// src/app/api/stripe/webhook/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

// ❌ sin apiVersion para evitar el error de tipos
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Necesitamos el raw body para verificar la firma
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Invalid signature', err?.message)
    return NextResponse.json({ error: `Webhook Error: ${err?.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const subscriptionId = session.subscription as string | undefined
        const customerId = session.customer as string | undefined

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              is_premium: true,
              stripe_customer_id: customerId ?? null,
              stripe_subscription_id: subscriptionId ?? null,
              stripe_subscription_status: 'active',
              premium_since: new Date().toISOString(),
            })
            .eq('id', userId)
        }
        break
      }

      // En algunas versiones de TS, Invoice no tipa .subscription -> lo leemos vía any
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any)?.subscription as string | undefined
        if (subscriptionId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              is_premium: true,
              stripe_subscription_status: 'active',
            })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from('profiles')
          .update({
            is_premium: sub.status === 'active' || sub.status === 'trialing',
            stripe_subscription_status: sub.status,
          })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from('profiles')
          .update({
            is_premium: false,
            stripe_subscription_status: 'canceled',
          })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      // (Opcional) si quieres cubrir fallo de pago también:
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any)?.subscription as string | undefined
        if (subscriptionId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              is_premium: false,
              stripe_subscription_status: 'past_due',
            })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      default:
        // no-op
        break
    }
  } catch (err) {
    console.error('Webhook handler error', err)
    // devolvemos 200 igualmente para que Stripe no reintente infinitamente
  }

  return NextResponse.json({ received: true })
}
