import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #818cf8, #4f46e5)',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 100,
            marginBottom: 20,
          }}
        >
          ♈ ♉ ♊ ♋ ♌ ♍
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          CelebsHome
        </div>
        <div
          style={{
            fontSize: 30,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
          }}
        >
          Discover Your Favorite Celebrities' Zodiac Signs
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 100,
            marginTop: 20,
          }}
        >
          ♎ ♏ ♐ ♑ ♒ ♓
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
