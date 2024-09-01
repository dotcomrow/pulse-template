import { headers } from "next/headers";

export const runtime = 'edge';

export default function Home() {
  const headersList = headers()
  const auth = headersList.get('Authorization')

  
  if (auth) {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
