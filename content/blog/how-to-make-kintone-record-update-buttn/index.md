---
title: kintnoeのレコード詳細画面にレコード内のサブテーブルを更新するボタンを作る
date: "2020-02-27"
category: Tech
tags:
    - kintone
    - javascript
cover: ./no-image.png
---

最近、仕事で kintone に触れることが多い。
今日は kintone のレコード詳細画面に、レコード内のサブテーブルを更新するボタンを作ってみたのでまとめてみる。

以下のようにすればできそうだけどこれだとダメ。

```javascript
const updateRecord = () => {
    const { record } = kintone.app.record.get();
    record.SUB_TABLE.value.forEach((row) => {
        row.value.example.value = "example";
    });
    kintone.app.record.set({ record });
};

kintone.events.on(["app.record.detail.show"], () => {
    if (document.getElementById("updateButton") === null) {
        const myIndexButton = document.createElement("button");
        myIndexButton.id = "updateButton";
        myIndexButton.innerText = "更新ボタン";
        myIndexButton.onclick = updateRecord;
        kintone.app.record
            .getHeaderMenuSpaceElement()
            .appendChild(myIndexButton);
    }
});
```

ドキュメントにも以下のように書いてあったりする。

[レコードに値をセットする](https://developer.cybozu.io/hc/ja/articles/201942014-%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89%E8%A9%B3%E7%B4%B0%E6%83%85%E5%A0%B1%E5%8F%96%E5%BE%97#step4)

> kintone.events.on のインベントハンドラ内で kintone.app.record.set および kintone.mobile.app.record.set を実行することはできません。 上記のイベントハンドラ内ではレコードデータの取得は引数の event オブジェクトを、レコードデータの更新は event オブジェクトの return を使用してください。

とはいえ、`myIndexButton.onclick`に登録した関数に event オブジェクトを渡して event オブジェクトを return しても意味はない。

```javascript
const updateRecord = (event) => () => {
    const { record } = event;
    record.SUB_TABLE.value.forEach((row) => {
        row.value.example.value = "example";
    });
    return event;
};
```

ということで、`kintone JS SDK`を使う。

[kintone-JS-SDK](https://developer.cybozu.io/hc/ja/articles/360025484571-kintone-JS-SDK)

これを使うとこんな感じでかける。

```javascript
const kintoneConnection = new kintoneJSSDK.Connection();
const kintoneRecord = new kintoneJSSDK.Record({
    connection: kintoneConnection,
});

const updateRecord = async () => {
    const { record } = kintone.app.record.get();
    const changedTable = record.SUB_TABLE.value.map((row) => {
        row.value.example.value = "example";
        return row;
    });

    try {
        await kintoneRecord.updateRecordByID({
            app: kintone.app.getId(),
            id: kintone.app.record.getId(),
            record: {
                SUB_TABLE: {
                    value: changedTable,
                },
            },
        });
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};

kintone.events.on(["app.record.detail.show"], () => {
    if (document.getElementById("updateButton") === null) {
        const myIndexButton = document.createElement("button");
        myIndexButton.id = "updateButton";
        myIndexButton.innerText = "更新ボタン";
        myIndexButton.onclick = updateRecord;
        kintone.app.record
            .getHeaderMenuSpaceElement()
            .appendChild(myIndexButton);
    }
});
```

サブテーブルの各レコードに設定する値を非同期な関数(以下だと`asynchronousFunction()`)で取得している場合はこんな感じでいけます。

```javascript
const updateRecord = async () => {
    const { record } = kintone.app.record.get();
    const changedTable = await Promise.all(
        record.SUB_TABLE.value.map(async (row) => {
            row.value.example.value = await asynchronousFunction();
            return row;
        })
    );

    try {
        await kintoneRecord.updateRecordByID({
            app: kintone.app.getId(),
            id: kintone.app.record.getId(),
            record: {
                SUB_TABLE: {
                    value: changedTable,
                },
            },
        });
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};
```
