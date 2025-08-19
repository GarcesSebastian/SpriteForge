"use client"

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from 'js-cookie';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const params = useSearchParams();
    const email = params.get('email');
    const permission = params.get('permission');

    useEffect(() => {
        console.log(email, permission);
        const shareProject = async () => {
            if (status === "authenticated" && email && permission) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/share`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${Cookies.get("token")}`,
                        },
                        body: JSON.stringify({
                            email: session.user?.email,
                            sharer: email
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to share project");
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    router.push("/");
                }
            }
        };

        shareProject();
    }, [status, email, permission, router, session]);

    return <h1>Share</h1>;
}