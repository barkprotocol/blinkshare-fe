import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'

export async function createToken(connection: Connection, payer: PublicKey) {
  const mint = await createMint(
    connection,
    payer,
    payer,
    payer,
    9
  )

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer
  )

  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    1000000000 // 1 billion tokens
  )

  return mint.toBase58()
}

export async function signAndConfirmTransaction(connection: Connection, transaction: Transaction, wallet: any) {
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  transaction.feePayer = wallet.publicKey

  const signed = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
  await connection.confirmTransaction(signature)

  return signature
}

export function calculateBlinkFee(amount: number): number {
  const feePercentage = 0.002 // 0.2%
  return amount * feePercentage
}

