import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
    try {
        // Check for signing secret
        const SIGNING_SECRET = process.env.SIGNING_SECRET
        if (!SIGNING_SECRET) {
            console.error('Missing SIGNING_SECRET environment variable')
            return new Response('Server configuration error', { status: 500 })
        }

        const wh = new Webhook(SIGNING_SECRET)
        const headerPayload = await headers()

        // Get Svix headers
        const svix_id = headerPayload.get('svix-id')
        const svix_timestamp = headerPayload.get('svix-timestamp')
        const svix_signature = headerPayload.get('svix-signature')

        console.log('Received headers:', {
            svix_id: svix_id ? 'present' : 'missing',
            svix_timestamp: svix_timestamp ? 'present' : 'missing',
            svix_signature: svix_signature ? 'present' : 'missing'
        })

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error('Missing required Svix headers')
            return new Response('Missing required headers', { status: 400 })
        }

        // Get and parse payload
        const payload = await req.json()
        const body = JSON.stringify(payload)

        console.log('Webhook event type:', payload.type)

        // Verify webhook signature
        let evt: WebhookEvent
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp
            }) as WebhookEvent
        } catch (err) {
            console.error('Webhook verification failed:', err)
            return new Response('Webhook verification failed', { status: 400 })
        }

        const eventType = evt.type
        console.log('Processing event type:', eventType)

        // Handle different event types
        if (eventType === "user.created") {
            const { data } = evt

            // Validate required fields
            if (!data.id) {
                console.error('Missing user ID in user.created event')
                return new Response('Missing user ID', { status: 400 })
            }

            try {
                const userName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User'
                const userImageUrl = data.image_url || undefined

                await db.insert(users).values({
                    clerkId: data.id,
                    name: userName,
                    imageUrl: userImageUrl
                })
                console.log('User created successfully:', data.id)
            } catch (dbError) {
                console.error('Database error creating user:', dbError)
                return new Response('Database error', { status: 500 })
            }
        }

        if (eventType === 'user.deleted') {
            const { data } = evt

            if (!data.id) {
                console.error('Missing user ID in user.deleted event')
                return new Response('Missing user ID', { status: 400 })
            }

            try {
                await db.delete(users).where(eq(users.clerkId, data.id))
                console.log('User deleted successfully:', data.id)
            } catch (dbError) {
                console.error('Database error deleting user:', dbError)
                return new Response('Database error', { status: 500 })
            }
        }

        if (eventType === 'user.updated') {
            const { data } = evt

            if (!data.id) {
                console.error('Missing user ID in user.updated event')
                return new Response('Missing user ID', { status: 400 })
            }

            try {
                const userName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User'
                const userImageUrl = data.image_url || undefined

                await db.update(users).set({
                    name: userName,
                    imageUrl: userImageUrl
                }).where(eq(users.clerkId, data.id))
                console.log('User updated successfully:', data.id)
            } catch (dbError) {
                console.error('Database error updating user:', dbError)
                return new Response('Database error', { status: 500 })
            }
        }

        return new Response('Webhook received successfully', { status: 200 })

    } catch (error) {
        console.error('Unexpected error in webhook handler:', error)
        return new Response('Internal server error', { status: 500 })
    }
}