# article-search-service
doi, pubmed, arxiv.org的查询服务API接口，部署于vercel云函数

# 云函数

[vercel](https://vercel.com/)，国内可能被qiang了。

- DOI接口
``` text 
POST https://article-search-service.vercel.app/api/doi_spider
请求数据 =>  {
                "doi": "10.1007/bf02983529"
            }
Content-Type: application/json
```
返回结果
``` json
{
  "code": "OK",
  "msg": "",
  "data": {
    "doi": "10.1007/bf02983529",
    "pmid": "",
    "arxiv_id": "",
    "origin_url": "http://dx.doi.org/10.1007/bf02983529",
    "title": "Diamond-Blackfan Anemia in Japan: Clinical Outcomes of Prednisolone Therapy and Hematopoietic Stem Cell Transplantation",
    "author": [
      "Shouichi Ohga",
      "Hideo Mugishima",
      "Akira Ohara",
      "Seiji Kojima",
      "Kohji Fujisawa",
      "Keiko Yagi",
      "Masamune Higashigawa",
      "Ichiro Tsukimoto"
    ],
    "organization": [
      "for the Aplastic Anemia Committee of the Japanese Society of Pediatric Hematology"
    ],
    "magazine": [
      "International Journal of Hematology"
    ],
    "publisher": "Springer Science and Business Media LLC",
    "publication_year": 2021,
    "category": [
      "Hematology"
    ],
    "research_area": "",
    "issue_description": ""
  }
}
```

- Pubmed接口
``` text 
POST https://article-search-service.vercel.app/api/pmid_spider
请求数据 =>  {
                "pmid": "31173853"
            }
Content-Type: application/json
```
返回结果
``` json
{
  "code": "OK",
  "msg": "",
  "data": {
    "doi": "10.1016/j.canlet.2019.05.035",
    "pmid": "31173853",
    "arxiv_id": "",
    "origin_url": "http://dx.doi.org/10.1016/j.canlet.2019.05.035",
    "title": "Exosomal transfer of miR-501 confers doxorubicin resistance and tumorigenesis via targeting of BLID in gastric cancer",
    "author": [
      "Xu Liu",
      "Ying Lu",
      "Yunchao Xu",
      "Sizhu Hou",
      "Jinli Huang",
      "Bo Wang",
      "Jinyao Zhao",
      "Shilin Xia",
      "Shujun Fan",
      "Xiaotang Yu",
      "Yue Du",
      "Li Hou",
      "Zhiyue Li",
      "Zijie Ding",
      "Shuo An",
      "Bo Huang",
      "Lianhong Li",
      "Jianwu Tang",
      "Jingfang Ju",
      "Hongwei Guan",
      "Bo Song"
    ],
    "organization": [],
    "magazine": [
      "Cancer Letters"
    ],
    "publisher": "Elsevier BV",
    "publication_year": 2021,
    "research_area": "",
    "issue_description": ""
  }
}
```

- arXiv接口
``` text 
POST https://article-search-service.vercel.app/api/arxiv_spider
请求数据 =>  {
                "arxiv_id": "2008.09595"
            }
Content-Type: application/json
```
返回结果
``` json
{
  "code": "OK",
  "msg": "",
  "data": {
    "doi": "",
    "pmid": "",
    "arxiv_id": "2008.09595",
    "origin_url": "http://arxiv.org/abs/2008.09595v4",
    "title": "Isolated singularities for the n-Liouville equation",
    "author": [
      "Pierpaolo Esposito"
    ],
    "organization": [],
    "magazine": [
      "arXiv"
    ],
    "publisher": "arXiv",
    "publication_year": 2020,
    "category": [
      "Analysis of PDEs",
      "35A21, 35B40 (Primary) 35B33, 35J92 (Secondary)"
    ],
    "research_area": "",
    "issue_description": ""
  }
}
```

# 代码结构
``` text
- api
--- arxiv_spider.py    # arxiv脚本
--- doi_spider.js      # doi脚本
--- pmid_spider.js   # pubmed脚本
- arXiv_subject.csv      # arxiv主题
- now.json
- package.json
- requirements.txt
```

# 部署流程

``` bash
vercel login
vercel -d --prod
# 完成后可用自己的域名进行访问
```

