---
title: helmについて調べてみる
date: "2020-03-01"
category: Tech
tags:
    - kubernetes
    - infra
cover: ./helm.png
---

現職ではぼちぼち kubernetes に触れているが、なんとなく helm は避けてきた。

[helm](https://helm.sh/:embed:cite)

以下のような kubernetes におけるパッケージマネージャと言われている点に不安があったからだ。  
ある程度 kubernetes について理解してから使うならまだしも、あまり理解しないまま、helm を使って設定部分を隠蔽化してしまうことに不安があったのだと思う。

[Kubernetes のパッケージマネージャー Helm とは？](https://thinkit.co.jp/article/13414:embed:cite)

最近は kubernetes にも慣れてきて前述した不安も薄れてきたので、食わず嫌いをやめて少し調べてみる。

helm とはパッケージマネージャである、とはどういうことなのか調べてみた。  
Linux OS では`APT`,`Yum`,`DNF`などパッケージマネージャを使って、ソフトウェアのインストールを行うことができる。  
これらのツールは目的のソフトウェアが依存している他のソフトウェアのインストールも自動で行い、手動での依存関係の解決無しに目的のソフトウェアのインストールを簡単に行えるようにしてくれている。

この考え方を kubernetes に適用した結果できたのが helm とのこと。  
helm を使うことで、kubernetes クラスターに必要とするソフトウェアが稼働する Pod および、Service などの kubernetes リソースを作成することが簡単にできるらしい。  
Linux のパッケージマネージャと同様にレポジトリが存在し、そこから Chart と呼ばれるパッケージ(前述した、ソフトウェアが稼働する Pod および、Service などの kubernetes リソースをまとめたもの)をインストールする。

[Helm Hub](https://hub.helm.sh/)

Chart が依存する Chart を指定でき、Linux のパッケージマネージャと同様に依存性を解決してくれる。

[managing-dependencies-with-the-dependencies-field](https://helm.sh/docs/topics/charts/#managing-dependencies-with-the-dependencies-field)

Chart 内の kubernetes 設定用の yaml は Go templates で記載できる。

[templates-and-values](https://helm.sh/docs/topics/charts/#templates-and-values)

```yaml
# k8s.yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

カスタマイズは`helm install`実行時に変数を記載したファイルを渡すことで行える。

-   values.yaml

```yaml
# values.yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

`helm install --values=values.yaml`

## まとめ

なんとなくわかった気がする。  
確かに便利だけど、インフラに基軸を置くものとしては、やっぱり多くの設定部分が隠蔽されてしまうのがなんとも気持ち悪い感じがしてしまう。  
全部管理下に置いておきたい的な意味で。  
アプリケーションエンジニアがサクッと動かす用途には適していそうだと感じた。
