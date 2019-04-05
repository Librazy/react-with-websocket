# React withWebSocket

Higher order components for better experience in React with websocket.

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=Librazy/react-with-websocket)](https://dependabot.com)

## Usage (with `WebSocket` from browser)

First, create a `WebSocket` object (for example, `ws`) in your (lower as possible) common ancestor of Components that require data from WebSocket, and wrap its children with a `<WebSocketContextProvider value={ws}>`.

That will be the source of WebSocket for those Components.

For each Component, we need to:

1. Subscribe to a WebSocket

2. Provide it a WebSocket

For the first part, we will create a subscription using `createSubscription`

```typescript
const withSubscription = createSubscription(
    initState,
    fallbackProps,
    mapStateToProps,
    mapMessageToState,
    mapEventToState,
)
```

The subscription has a state initialized with `initState`. When there are new message from WebSocket, you need to `mapMessageToState`.

> It receive a message event, return new state (or a function that map previous state to new state).

Similarly when there are new event like `open`,`close`,`error`, you can `mapEventToState` but that is optional.

Then you `mapStateToProps`.

> It receive current state (and optionally the WebSocket object) and map it to (some of) your Component's props.
>
> If the props returned from `mapStateToProps` is falsey, then it will use the value from `fallbackProps`.

Finally you apply the subscription to Component.

```typescript
const ComponentWithSubscription = withSubscription(Component)
```

And the second part, let's feed the result with a WebSocket:

```typescript
const ComponentWithWebSocketSubscription = withWebSocket(Component)
```

Then, you can use `ComponentWithWebSocketSubscription` in place of `Component` with some props subscribed to WebSocket.

For convenient, `createWebSocketSubscription` works as `createSubscription` then `withWebSocket`.

[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B5289%2Fgit%40github.com%3ALibrazy%2Freact-with-websocket.git.svg?type=large)](https://app.fossa.io/projects/custom%2B5289%2Fgit%40github.com%3ALibrazy%2Freact-with-websocket.git?ref=badge_large)
