import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Mapa de price IDs en el SERVIDOR (no públicos)
const PRICES = {
  basic: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_BASIC_YEARLY,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  team: {
    monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_TEAM_YEARLY,
  },
} as const

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, email, priceId, planId, cycle } = body as {
      userId?: string; email?: string; priceId?: string;
      planId?: keyof typeof PRICES; cycle?: 'monthly' | 'yearly'
    }

    if (!userId || !email) {
      return NextResponse.json({ error: 'Faltan userId o email' }, { status: 400 })
    }

    // Compat: si te envían priceId directo, úsalo; si no, resuélvelo por planId/cycle
    const resolvedPriceId =
      priceId ||
      (planId && cycle ? PRICES[planId]?.[cycle] : undefined)

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: `PriceId no configurado para ${planId ?? 'N/A'} / ${cycle ?? 'N/A'}` },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // o 'payment' si quieres pago único
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      customer_email: email,
      metadata: { user_id: userId, plan_price_id: resolvedPriceId },
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium?status=cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error('checkout error', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
