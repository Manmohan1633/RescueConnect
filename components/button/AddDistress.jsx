
import Link from "next/link"

export default function AddDistress() {
    return(
        <Link href="/distressForm">
        <button className="border-2 border-gray-600  h-fit">add</button>
        </Link>
    )
}