import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.floofy.dev/sponsors/auguwu?show_private=true&pricing=cents')
      .then((res) => res.json())
      .then((body) => setData(body));
  }, []);

  return <div>
    <pre>
      <code className='font-mono'>
        {data}
      </code>
    </pre>
  </div>;
}
