## API

目录

1\. 初始化卡牌  
2\. 用卡抽卡  
3\. 获取当前牌堆信息  
4\. 获取loot卡牌  
5\. 选择loot卡牌  

---

####**1\. 初始化卡牌**
###### 接口功能
> 玩家进入一层，通过缓存牌堆生成当前层的抽牌堆  
> 从抽牌堆中，抽取N张卡牌到手牌中，目前N=5  


###### 请求参数
> |参数|必选|类型|值|
|:-----  |:-------|:-----|------|
|handler    |ture    |string|card|
|event    |true    |string   |draw|
|rawData    |true    |object   |{token: this.userToken, discard: null}|

###### 返回字段
> |返回|字段|说明                              |
|:-----   |:------|:-----------------------------   |
|code   |int    |返回结果code   |
|handInfo  |list | 手牌id的列表                      |

###### 接口示例

``` javascript
draw(){
	this.send({
    	handler:'card',
		event:'draw',
        rawData:{
            token:this.userToken,
            discard:null
        }
    });
}
```
####**2\. 抽卡用卡**
###### 接口功能
> 一回合开始，从抽牌堆中，抽取N张卡牌到手牌中，若抽牌堆中没有卡牌则将弃牌堆中的卡重新洗牌放入，目前N=5  
> 玩家行动，将消耗的卡(本回合进入过手牌的)牌进入弃牌堆  

###### 请求参数
> |参数|必选|类型|值|
|:-----  |:-------|:------|------|
|handler    |ture    |string|card|
|event    |true    |string   |draw|
|rawData    |true    |object   |{token: this.userToken, discard: [弃牌ID列表]}|

###### 返回字段
> |返回|字段|说明                              |
|:-----   |:------|:-----------------------------   |
|code   |int    |返回结果code   |
|handInfo  |list | 手牌id的列表                      |

###### 接口示例

``` javascript
draw(){
	this.send({
    	handler:'card',
		event:'draw',
        rawData:{
            token:this.userToken,
            discard:["200_001_10001","200_001_10002","200_001_10002","200_001_10001","200_001_10001"]
        }
    });
}
```
####**3\. 获取当前牌堆信息**
###### 接口功能
> 获取当前抽牌堆及弃牌堆信息

###### 请求参数
> |参数|必选|类型|值|
|:-----  |:-------|:-----|------|
|handler    |ture    |string|card|
|event    |true    |string   |current|
|rawData    |true    |object   |{token: this.userToken}|

###### 返回字段
> |返回|字段|说明                              |
|:-----   |:------|:-----------------------------   |
|code   |int    |返回结果code   |
|cardsInfo  |list | 抽牌堆中的卡牌ID列表和弃牌堆中的卡牌ID列表                      |

###### 接口示例

``` javascript
current(){
	this.send({
    	handler:'card',
		event:'current',
        rawData:{
            token:this.userToken
        }
    });
}
```
####**4\. 获取loot卡牌堆**
###### 接口功能
> 获取loot卡牌堆供玩家选择loot卡牌

###### 请求参数
> |参数|必选|类型|值|
|:-----  |:-------|:-----|------|
|handler    |ture    |string|card|
|event    |true    |string   |getLoot|
|rawData    |true    |object   |{token: this.userToken}|

###### 返回字段
> |返回|字段|说明                              |
|:-----   |:------|:-----------------------------   |
|code   |int    |返回结果code   |
|lootInfo  |list | loot卡牌ID列表                      |

###### 接口示例

``` javascript
getLoot(){
	this.send({
    	handler:'card',
		event:'getLoot',
        rawData:{
            token:this.userToken
        }
    });
}
```
####**5\. 选择loot卡牌**
###### 接口功能
> 玩家选择loot卡牌堆中的一张作为最终的loot卡牌

###### 请求参数
> |参数|必选|类型|值|
|:-----  |:-------|:-----|------|
|handler    |ture    |string|card|
|event    |true    |string   |setLoot|
|rawData    |true    |object   |{token: this.userToken, lootId: 'loot卡牌ID'}|

###### 返回字段
> |返回|字段|说明                              |
|:-----   |:------|:-----------------------------   |
|code   |int    |返回结果code   |
|success  |bool | loot卡牌是否成功选择                      |

###### 接口示例

``` javascript
setLoot(){
	this.send({
    	handler:'card',
		event:'setLoot',
        rawData:{
            token:this.userToken,
            lootId: "200_001_10001"
        }
    });
}
```