import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear authentication token on client side
    // The actual logout is handled on the client side via localStorage
    
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Optional: Set token cookie to empty if using cookies
    // response.cookies.set({
    //   name: 'auth-token',
    //   value: '',
    //   httpOnly: true,
    //   expires: new Date(0),
    // });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
