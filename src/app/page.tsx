import Link from "next/link";

export default function Page(){
    return <div className="p-6">
        <h1 className="text-2xl font-bold">{process.env.NEXT_PUBLIC_TITLE}</h1>
        <p className="text-zinc-600">Silakan <Link className="text-ps-600 underline" href={'/login'}>login</Link> untuk masuk ke dashboard.</p>
    </div>;
}