import React from 'react'
'use client';

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";

const Header = () => {
    const pathname = usePathname();
  return (
    <header>
        <div className="main-container inner">
            <Link href="/">
            <Image src="logo.svg" alt="coinPulse logo" width={132} height={40} />
            </Link>

            <nav>
                <Link href ='/' className={}>Home</Link>

                <p>Search Modal</p>
                <Link href="/coins">All Coins</Link>
            </nav>

        </div>
    </header>
  )
}

export default Header
