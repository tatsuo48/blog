---
title: GatsbyJSのLinkコンポーネントのリンク先指定にテンプレート文字列を使う。
date: "2020-05-09"
category: Tech
tags:
    - javascript
    - gatsbyjs
---

当たり前といえば当たり前だが少し迷ったので備忘録としてここに書く。

```jsx
<Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
```

{}の中は JavaScript の世界！
JSX に慣れないなぁ。。
