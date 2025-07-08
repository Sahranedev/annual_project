This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuration de Stripe

### Variables d'environnement

Pour utiliser Stripe dans l'applicatio ajoutez les variables suivantes dans votre fichier `.env.local` :

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_cle_webhook
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Architecture de l'intégration Stripe

L'intégration de Stripe est répartie dans les fichiers suivants : suivants :

1. `src/types/payment.ts` : Types pour les paiements
2. `src/lib/stripe.ts` : Initialisation de Stripe côté client et serveur
3. `src/app/api/checkout/route.ts` : API endpoint pour les paiements
4. `src/app/api/webhook/stripe/route.ts` : Gestionnaire de webhooks
5. `src/components/checkout/CheckoutButton.tsx` : Bouton de paiement
6. `src/app/checkout/success/page.tsx` : Page de succès après paiement

### Installation de Stripe CLI

Pour tester les webhooks Stripe en local :

1. Téléchargez et installez Stripe CLI depuis [la page d'installation officielle](https://stripe.com/docs/stripe-cli)

```bash
# Sur Linux (faur voir pour vos version macos et windows)
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

2. Connectez-vous à votre compte Stripe (appuyer sur la touche entrée pour valider depuis la page web qui s'ouvrira):

```bash
stripe login
```

3. Démarrez l'écoute des webhooks (à exécuter dans un terminal séparé) :

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

4. Notez la clé secrète du webhook générée et ajoutez-la dans votre fichier `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_votre_cle_webhook_generee
```

### Test des paiements

Pour tester un paiement :

1. Utilisez les cartes de test fournies par Stripe :

   - Carte réussie : `4242 4242 4242 4242`
   - Carte refusée : `4000 0000 0000 0002`
   - Date d'expiration : n'importe quelle date future
   - CVC : n'importe quel nombre à 3 chiffres
   - Code postal : n'importe quel code postal valide

2. Pour tester les webhooks manuellement :

```bash
stripe trigger payment_intent.succeeded
stripe trigger checkout.session.completed
```

### Déboguer les webhooks

Pour surveiller les logs des webhooks :

1. Vérifiez les logs de la console lors de la réception d'un webhook
2. Dans le dashboard Stripe, consultez les webhooks envoyés dans la section "Developers > Webhooks"
3. Utilisez l'option `--print-json` avec Stripe CLI pour voir les données complètes :

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe --print-json
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
