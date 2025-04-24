import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { query, variables, operationName } = await request.json();
  
  const ASTRA_DB_URL = process.env.NEXT_PUBLIC_ASTRA_GRAPHQL_ENDPOINT || "";
  const ASTRA_DB_TOKEN = process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || "";

  try {
    console.log("Astra DB URL:", { query, variables, operationName, ASTRA_DB_TOKEN, ASTRA_DB_URL } );
    const response = await fetch(ASTRA_DB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cassandra-Token': ASTRA_DB_TOKEN,
      },
      body: JSON.stringify({ query, variables, operationName })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch from Astra DB' },
      { status: 500 }
    );
  }
}
