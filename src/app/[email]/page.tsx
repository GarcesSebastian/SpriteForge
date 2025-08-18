"use client"

import { useSearchParams } from "next/navigation";

export default function Page() {
    const params = useSearchParams();
    const email = params.get('email');
    const permission = params.get('permission');

    return <h1>Share</h1>;
}