---
title: Terraform Providerのつくり方
date: "2020-10-10"
category: Tech
tags:
    - terraform
    - infra
cover: ./terraform.png
---

## はじめに

普段の業務の中ではTerraformでインフラリソースを管理することが多い。  
今回、SendGridを新規に利用するにあたり、IPアクセス制限をTerraformで管理したいなぁと思ったが、自分の用途に合ったProviderが見つからなかった。  
既存のProviderにPRを送ってもよかったが、TerraformerとしてProviderを一から作る経験をしてみねばと思い、勢いで作った。

出来上がったProviderがこちら。

[tatsuo48/sendgrid](https://registry.terraform.io/providers/tatsuo48/sendgrid/latest)

目的通り、IPアクセス制限部分の管理だけができる状態となっている。  
以下では、具体的な作り方について書いていく。

## リソースの定義を決める

まず初めに決めるべきなのは何をリソースとして管理するのか？ということだ。  
例えば、今回作成したProviderのケースだとアクセス許可IP1つずつを1リソースとして管理する形をとっている。

```hcl
resource "sendgrid_whitelist_ip" "first" {
  ip = "192.168.0.1/32"
}
```

これは、例えば以下のようにIPリスト全体で1リソースという捉え方もあったかもしれない。

```hcl
resource "sendgrid_whitelist_ips" "first" {
  ips = [
    "192.168.0.1/32"
    "192.168.0.2/32"
  ]
}
```

利用するAPI定義や実運用のことを考えて適切なリソース定義を作るようにする必要がある。  
今回のケースだと、SendGridのAPIがそもそもアクセス許可IPを1つずつ管理する形をとっているため、前者を選択している。

## CRUDの実装

リソース定義が決まったら、実際のリソースに対するCRUDの実装を行なっていく。

以下のレポジトリの`sendgrid/resource_whitelist_ip.go`の`resourceWhitelistIP`のように`*schema.Resource`を返す関数を定義する。
`*schema.Resource`にはリソースのスキーマとCRUD操作を行う関数を定義していく。

[tatsuo48/terraform-provider-sendgrid](https://github.com/tatsuo48/terraform-provider-sendgrid)

リソースのスキーマはAPIの戻り値から必要なものだけ定義する。  
次に、CRUD操作を行う関数について説明したいのだが、Terraformのリソース周りは言葉がややこしいのでここで言葉を整理しておく。

- tfファイルに書かれたリソース構成 = リソース構成

```hcl
こういうやつ
resource "sendgrid_whitelist_ip" "first" {
  ip = "192.168.0.1/32"
}
```

- tfstateファイルに記録されるリソース状態 = リソース状態

```json
こういうやつ
{
  "mode": "managed",
  "type": "sendgrid_whitelist_ip",
  "name": "first",
  "provider": "provider[\"hashicorp.com/tatsuo48/sendgrid\"]",
  "instances": [
    {
      "schema_version": 0,
      "attributes": {
        "created_at": 1601898379,
        "id": "1948555",
        "ip": "127.0.0.1/32",
        "last_updated": null,
        "rule_id": 1948555,
        "updated_at": 1601898379
      },
      "private": "eyJzY2hlbWFfdmVyc2lvbiI6IjAifQ=="
    }
  ]
}
```

- API操作される実際のリソース = 実リソース

では、CRUD操作を行う関数の説明に入る。
それぞれ以下を行なっている。

- C(reate)  
リソース構成を元にAPIリクエストを行い、実リソースを作成する。  
APIの戻り値を元に、リソース状態のIDだけ反映。  
最後にR(ead)を実行して、実リソースの情報をリソース状態に反映する

- R(ead))  
リソース状態に記録されたIDを元にAPIリクエストを行い、実リソースの情報を取得する。  
取得した実リソースの情報をリソース状態に反映する。

- U(pdate)  
リソース状態とリソース構成に差分がある場合にAPIリクエストを行い、実リソースを更新する。  
最後にR(ead)を実行して、実リソースの情報をリソース状態に反映する。

- D(elete)  
リソース状態に記録されたIDを元にAPIリクエストを行い、実リソースを削除する。  
最後にリソース状態のIDを空にすることで、リソース状態からも削除する。

これらはterraformの以下のコマンドで次のように利用されている。

- terraform apply  
リソース状態に存在しないリソースについては、C(reate)される。  
リソース状態に存在し、リソース構成との間に差分がある場合は、U(pdate)される。  
差分があり、かつリソースのスキーマで`ForceNew: true`が設定されている場合は、D(elete)してC(reate)となる。

- terraform destroy  
D(elete)される。

U(pdate)に関しては、API側でそもそもUpdateできる作りになっていないため、関数を定義しない場合もある。
今回はそのケースだったので`*schema.Resource`に`UpdateContext`が存在しない。

最後に、定義した関数(`resourceWhitelistIP`)を`sendgrid/provider.go`の`Provider`関数の戻り値である`*schema.Provider`の`ResourcesMap`に設定する。
こうすることで、Provider読み込み時にこのリソース定義が利用可能になる。

## 認証情報の渡し方

API利用に必要な認証情報の設定は`sendgrid/provider.go`の`Provider`関数の戻り値である`*schema.Provider`に設定する、`ConfigureContextFunc`で行う。
この関数で返した値が各リソースのCRUD操作を行う関数に渡される。

```go
func providerConfigure(ctx context.Context, d *schema.ResourceData) (interface{}, diag.Diagnostics) {
	apikey := d.Get("api_key").(string)
	var diags diag.Diagnostics
	if apikey == "" {
		return nil, diag.Errorf("api key is not set, please see this document https://registry.terraform.io/providers/tatsuo48/sendgrid/latest/docs#authentication")
	}
	return apikey, diags
}
```

```go
func resourceWhitelistIPCreate(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
    apiKey := m.(string) // これがproviderConfigureで返したapikeyとなる。
```

認証情報は以下のように`Provider`関数で設定すると、環境変数`SENDGRID_API_KEY`があればその値が使われ、存在しない場合は、terraform実行時に対話形式で設定するようになる。
```go
func Provider() *schema.Provider {
	return &schema.Provider{
		Schema: map[string]*schema.Schema{
			"api_key": {
				Type:        schema.TypeString,
				Required:    true,
				Sensitive:   true,
				DefaultFunc: schema.EnvDefaultFunc("SENDGRID_API_KEY", nil),
			},
		},
```

## テスト

テスト用のフレームワークが用意されており、それに即した形でテストを行う。  

[testing](https://www.terraform.io/docs/extend/testing/index.html)

基本的に実際のAPIを使った形でテストが行われるので、課金が発生するサービスの場合は注意が必要。
フレームワークの使い方については上記のドキュメントにあるのでここでは割愛させていただく。

## 参考資料

- [Call APIs with Terraform Providers](https://learn.hashicorp.com/collections/terraform/providers)  
とても良い資料、というかこれがないとProvider作れなかったと思う。
