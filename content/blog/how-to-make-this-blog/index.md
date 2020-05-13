---
title: このブログの作り方
date: "2020-05-13"
category: Tech
tags:
    - javascript
    - gatsbyjs
    - aws
cover: ./blogger.png
---

このブログは Gatsby.jsS を使って作り、ホスティング先は AWS Amplify を選択している。
今日はこれらの構成要素について書いていく。

## Gatsby.JS

[Gatsby.js](https://www.gatsbyjs.org/)  
[HUGO](https://gohugo.io/)や[Middleman](https://middlemanapp.com/)と同じく静的サイトジェネレータと呼ばれるツールである。  
いずれもバックエンドサーバを必要とせず、S3 などのファイルホスティングサービスにビルドの成果物である、HTML,CSS,JavaScript ファイルを配置するだけで Web サイトを構築できてしまう。  
Gatsby.js には[Gatsby.js で作られたサイトを紹介するページ](https://www.gatsbyjs.org/showcase/)があり、そこを見てもらうとわかるのだが、[SendGrid](https://www.gatsbyjs.org/showcase/sendgrid.comdocs)、[Nike](https://www.gatsbyjs.org/showcase/justdoit.nike.com)などの有名企業でも使われていたりする。

HUGO や Middleman はそれぞれビルド作業に Go 言語、Ruby を使うが、Gatsby.js はビルドにも JavaScript(Node.js)を使っている。また React がベースになっており、React ができる人にとっては敷居も低い。この辺りが理由でフロントエンドエンジニアにとってはとっつきやすいのかもしれない。

Gatsby.js では、ビルド時には GraphQL を使って Gatsby.js 外のデータを連携させることができる。  
例えば以下のように WordPress のデータを連携させることもできたりする。  
https://www.gatsbyjs.org/docs/sourcing-from-wordpress/  
この利点を活かすと、ビルド時だけ WordPress を起動して、普段は停止しておくといった運用もできたりする。  
このように JavaScript,APIs,Markdown で構成されたサイトは JAMStack と呼ばれている  
https://www.gatsbyjs.org/docs/glossary/jamstack/

## AWS Amplify

[AWS Amplify](https://aws.amazon.com/jp/amplify/)  
Amplify という 1 つのサービスにまとめられているが実態は 3 つに分かれている。  
それぞれ以下の通り。

-   Amplify ライブラリ  
    https://docs.amplify.aws/sdk  
    JAvaSCript,Andoroid,iOS から AWS サービスを利用するためのライブラリ

-   Amplify CLI  
    https://docs.amplify.aws/cli
    アプリが利用する AWS サービスの構築を行ってくれる CLI ツール  
    裏側では CloudFromtaion を利用して AWS サービスの作成、設定が行われている模様。  
    https://docs.amplify.aws/cli#infrastructure-as-code

-   Amplify コンソール  
    https://aws.amazon.com/jp/amplify/console/  
    サーバーレスウェブアプリケーションのホスティングツール

このサイトではこれらのうち`Amplify コンソール`を使い、静的サイトのホスティングを行っている。  
`Amplify コンソール`を使うと S3 や CloudFront,Route53 などの各種 AWS コンポーネントを意識せずに以下の定型作業を自動で行ってくれる

-   コンピューティングリソースを使ったビルドの実行
-   S3 へのビルド成果物の配置
-   Route53 へのドメイン登録
-   AWS Certified Manager による無料 SSL 証明書の取得
-   CloudFront による CDN 設定

これにより、AWS に詳しくない方でも簡単にデプロイが可能となっている。  
同種のサービスとしては Netlify がある。  
どちらを選ぶべきかは悩ましいところではあるが、私は普段から AWS に慣れてることもあり`Amplify コンソール`を選択した。
Netlify には[フォーム作成](https://docs.netlify.com/forms/setup/)や、[CMS 機能](https://www.netlifycms.org/)もあるようなので、そういった機能にメリットを感じる方は Netlify の方がよいかもしれない。
