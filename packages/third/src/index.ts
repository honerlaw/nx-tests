import { first } from "first"

export function third() {
    return {
        third: {
            first: first()
        }
    }
}

console.log(third())
