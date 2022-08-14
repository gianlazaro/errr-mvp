import Image from 'next/image';
import Link from 'next/link';

export default function Custom404() {
  return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', marginTop: '5%'}}>
    <Image src="https://http.cat/401" width="600" height="400" objectFit="contain"/>
    <Link href="/"><a>Go home</a></Link>
    </div>
}