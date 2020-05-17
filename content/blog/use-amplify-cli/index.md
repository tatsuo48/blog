---
title: AWS Amplifyを触ってみた。
date: "2020-05-17"
category: Tech
tags:
    - aws
    - javascript
    - graphql
cover: ./amplify.png
---

前から気になっていた AWS Amplify に触れてみたのでここにまとめておく。

## チュートリアルやってみた

AWS Amplify については以前も書いたので割愛。  
https://tatsuo48.me/how-to-make-this-blog/

[Tutorial](https://docs.amplify.aws/start/q/integration/react)があるのでまずはそれをやってみた。
簡単に Cognito、AppSync を使ったサイトができたのだが、中身がどうなっているのか全くわからなかった。
CloudFormation でいい感じ作ってくれてるのだなぁというのだけ雰囲気でわかった。
このまま使うには理解が不足していると思ったので、まずは Congnito について調べることにした。

## Cognito について

https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html

### ユーザプール

> Amazon Cognito を介して Web またはモバイルアプリにサインインしたり、サードパーティの ID プロバイダ(IdP)を介してフェデレートすることができます。

アプリケーションのユーザ基盤を管理し、認証を行ってくれる。
Googl OAuth などの IdP を使ったフェデレーションにも対応している。
ユーザプールにはログインしたユーザのプロファイルを持つこととなる。

### ID プール

> ユーザーは一時的に AWS の資格情報を取得して、Amazon S3 や DynamoDB などの AWS サービスにアクセスすることができます。
> ID プールでは、匿名のゲストユーザーをサポートしているほか、ID プールでユーザーを認証するために使用できる

以下のアイデンティティプロバイダもサポートしているとのこと

-   Amazon Cognito user pools
-   Social sign-in with Facebook, Google, Login with Amazon, and Sign in with Apple
-   OpenID Connect (OIDC) providers
-   SAML identity providers
-   Developer authenticated identities

### 思ったこと

どちらにも他の IdP(Google,Facebook)によるサインインがあるみたい。
つかいわけどうなるんだろう？  
https://aws.amazon.com/jp/premiumsupport/knowledge-center/cognito-user-pools-identity-pools/  
AWS に認証情報が欲しいかどうかが判断軸？  
ユースケースとしてはこんな感じらしい。  
https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-scenarios.html

## Amplify Authentication Tutorial

https://docs.amplify.aws/lib/auth/getting-started/q/platform/js  
こちらのチュートリアルの通りにやることで、簡単に GoogleOAuth を使った認証が行えた。  
AWS Amplify すごい。

## 思ったこと

裏側ではすごい勢いで CloudFormtaion がリソースを作っている。
どのように連携しているのかまだ理解が追いついていないが、とりあえず認証認可アリのアプリは作れそう。
インフラエンジニア不要ですねぇ。。

## AppSync の認証に Cognito ユーザプールを使う。

認証認可についてはわかってきたので、次は AppSync の認証を Cognito で行うようにしてみる。  
Cognito による認証、認可は以下の 2 パターンがある。

-   ユーザプール  
    https://docs.aws.amazon.com/appsync/latest/devguide/security.html#amazon-cognito-user-pools-authorization

-   ID プール  
     https://docs.aws.amazon.com/appsync/latest/devguide/security.html#aws-iam-authorization  
     ID プールの場合は発行する AWS 認証情報で IAM 制御する形になる？

AppSync の際はユーザプールを使うことが一般的とのことだったので、今回はユーザプールを使ってみた。
使ってみたとはいったが、実際は Authentication のチュートリアルをやることでユーザプールを使った認証の導入が済んでいたので、特にすることはない。
一個だけハマった所があって、ユーザプールによる認証を使う際はクエリの実行に、以下のように`AWSAppSyncClient`を使うのかと思ったが、そういうわけではなかった。  
https://docs.amplify.aws/lib/graphqlapi/authz/q/platform/js  
API キー認証利用と同様に、`API.graphql(graphqlOperation(<query>,<input>))` と書くことで Cognito ユーザプールを使った認証でもクエリが実行できた。

## AppSync の認可制御について

認証はできたので次は認可の制御を行っていく。先ほどの状態だと認証が通った人はどんなクエリでも AppSync に投げられるようになってしまっている。。  
Cognito のグループ単位の認可の制御であれば、query にアノテーションをつければ 簡単に実現できる。

```
type Query {
  contract(id: ID!): Contract
    @aws_auth(cognito_groups: [ “admin", “sale" ])
}
```

このように書くことで。`contract`は Cognito における`“admin", “sale"`グループに属するユーザだけが叩けるようになる。

さらに細かい権限管理がしたい(ユーザ単位)となると、AppSync のクエリに設定する、リゾルバーのマッピングテンプレートに定義することになる。
例えばチュートリアルで作成する TODO アプリにおいて、自分の todo だけ見れる状態にしたい場合、`getTodo`のレスポンスマッピングテンプレートに以下のように設定しておく。

```
#if($ctx.result.created_by == $ctx.identity.username)
    $utils.toJson($ctx.result)
#else
    $utils.unauthorized()
#end
```

そうすると、`$ctx.identity.username(Cognitoで認証しているユーザ名)`が`created_by(TODOの作成者を設定しておくカラム)`と同じ場合にだけリクエストが成功するようになる。
つまり、`created_by(TODOの作成者を設定しておくカラム)`がログインしているユーザと同じ TODO だけがクエリの結果として返ってくるようになる。

続いて、`listTodos`のクエリに設定するレスポンスマッピングテンプレートは以下の通り。

```
#set($targetRecords = [])
#foreach($item in $ctx.result.items)
    ## For Cognito User Pools use $ctx.identity.username instead
    #if($item.created_by == $ctx.identity.username)
        $util.qr($targetRecords.add($item))
    #end
#end
#set($myResults = {})
$util.qr($myResults.put("nextToken",$ctx.result.nextToken))
$util.qr($myResults.put("items",$targetRecords))
##$utils.toJson($ctx.result)
$utils.toJson($myResults)
```

DynamoDB に問い合わせた結果に対して、一行ずつループで回して判定するような実装なのでパフォーマンス的にあんまりよくなさそう。
実際は DynamoDB に`created_by`の GSI を追加してそれを使って DynamoDB へのクエリの段階で絞り込むといいのかな？

リゾルバーのテンプレートは Amplify を使っている場合、所定のディレクトリ(`amplify/backend/api/api名/resolvers`)に所定のファイル名(例えば`Query.getTodo.req.vtl`)で配置して、`amplify push`するだけで OK。CloudFormation によるリゾルバーのテンプレートのデプロイを行ってくれる。  
https://docs.amplify.aws/cli/graphql-transformer/resolvers

Amplify すごい。

## まとめ

リゾルバーのマッピングテンプレートの作成が辛い。  
VTL という言語で書かなければならないので、慣れるまでは時間がかかりそう。
