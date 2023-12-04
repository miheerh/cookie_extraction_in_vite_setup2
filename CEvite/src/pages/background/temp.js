import { Effect } from "effect"
// $ExpectType Effect<never, never, number>
const program = Effect.sync(() => {
  console.log("Hello, World!")
  return 1
})
// $ExpectType number
const result = Effect.runSync(program)
// Output: Hello, World!
console.log(result)