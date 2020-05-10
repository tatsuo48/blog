---
title: 最近読んだ本たち
date: "2020-03-28"
category: Life
tags:
    - book
cover: ./book.png
---

コロナのおかげでせっかくの有給消化なのに外出自粛になってしまった。
引き篭もってひたすら本を読んでいたので、読んだ本をまとめておこうかと思います。

## データ指向アプリケーション

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=tatsuo48-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873118700&linkId=251baaf2733432414c94e114dd19678c"></iframe>

転職ドラフトの友達紹介キャンペーンでいただきました。  
選んだ理由はプレゼントの上限 5000 円に一番近かったからという現金な理由です。

別に業務で分散システムを作るわけでもないしなーということで直接的には仕事に役に立たないかも？と思いながら読み始めました。
本書ではこの点をまず否定され、現代のアプリケーションは大抵の場合、CPU の演算能力ではなくデータ処理能力がボトルネックになってきているという事実を教えてくれました。

分散処理における合意とはなんなのか？など難しい話もたくさんあり正直理解は追いついてません。  
ただ、NoSQL におけるインデックスとはなんなのか？RDB の B-tree インデックスの仕組みについてなどこれまで理解していなかった部分を丁寧に説明してくれているので大きく理解が深まりました。
時間がない方は「第 I 部 データシステムの基礎」だけでも読んでみるといいと思います。

## レガシーコードからの脱却 ―ソフトウェアの寿命を延ばし価値を高める 9 つのプラクティス

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=tatsuo48-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873118867&linkId=698f31d81b040f7ce43ca74d231ddfc5"></iframe>

こちらも同じく転職ドラフトの友達紹介キャンペーンでいただきました。

-   転職ブログを書いて amazon ギフト券 1 万円分
-   本 2 冊
-   転職祝い金 Apple store ギフト券 10 万円分

ということで転職ドラフトさん本当にありがたいです。

この本にした理由はずばり、最近業務で kintone に触って本当につらいなーと思うことが多々あったためです。
kintone 自体は悪くないんですが、無秩序に設定された kintone のカスタマイズ用 JavaScript が大変メンテナンス性が低い状態でした。

自分で考えてメンテナンス性が高い状態にできないか色々やってみたんですが、果たしてこれは正しい方法なのか？ということが気になりました。
また、初めから自由に作れたとして、私は先人の失敗を生かして正しく作ることができるのか？という点も不安になりました。
これらの疑問、不安を解消できるのではと考えこの本を手にとった次第です。

レガシーコードを作らないための方法論はこれまで種々の本で読んだことがある内容でしたが、単なる方法論に終始せず、その裏側にある原則まで丁寧に書かれており、表層をなぞるだけでなく腹落ちすることができました。
結果として、この本を読むことで私のやっているレガシーコードの改善の方向は間違いではなかったと言い切れるようになりました。
また、正しく作れるのか？という点でもある程度自信を持てるようになりました。
あとはひたすら実践して技術を磨いていくしかないなと思います。

## ミックさんの SQL 本

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=tatsuo48-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07GB4CNKP&linkId=7f0fc3344ccc2173eb143fe878a8f37b"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=tatsuo48-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B00EE1XPAI&linkId=9cd0499c271e4832b1f4411dc23b8199"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=tatsuo48-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B01HD5VWWO&linkId=3bf709e51480422c651812147d3e2970"></iframe>

ずーっと積読になってしまっていたのでこの機会に一気に消化しました。
たしか、`ゼロからはじめるデータベース操作`は前職に入るときに買ったので約 3 年半ほど積んでいたことになります。

なんでこんなに積んでいたかというと、シンプルに業務上必要なかったからでした。
インフラエンジニアだと、基本的に SQL に触れる機会もパフォーマンスチューニングするときくらいなもので、なかなか書く機会もありませんでした。
あと、もともとがだいぶものぐさな質なので必要に迫られないと学ぶ気にならないのです。。

転職もしたし、このままではいけないなと思い、今回、DB 設計から SQL の基本文法、応用的な SQL の書き方までこの 3 冊でまとめて学習しました。

1. DB 設計 徹底指南書(設計)
1. ゼロからはじめるデータベース操作(基本文法)
1. SQL 徹底指南書(応用)

の順番で読むと良いかと思います。

読み終わったあとは以下のサイトで実際に SQL を書いてみました。
パズルみたいで楽しかったです。

[sqlzoo](https://sqlzoo.net/)

社会復帰まであと 3 日です。  
コロナも相変わらずなのでガンガン読んでくぞーー
