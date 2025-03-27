import Link from "next/link"

export default function AboutMe() {
    return (
        <div className="text-white text-xs flex gap-1">Made by
            <Link
                href={"https://www.youtube.com/@itsmeprinceyt"}
                target="_blank"
            >
                <span className="animate-pulse">@itsmeprinceyt</span>
            </Link> |
            <Link
                href={"https://github.com/itsmeprinceyt/prince-kun-website"}
                target="_blank"
            >
                <span className="animate-pulse">Github</span>
            </Link>
        </div>
    )
}