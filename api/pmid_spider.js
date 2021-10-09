let superagent = require('superagent');
let charset = require('superagent-charset');
charset(superagent);
let cheerio = require('cheerio');
const BASE_URL = "https://pubmed.ncbi.nlm.nih.gov/";
const API_CROSSREF = "https://api.crossref.org/v1/works/";
const successCode = 'OK';
const failCode = 'ERROR';

module.exports = (req, res) => {
    const pmid = req.body.pmid;
    console.log(`request => ${pmid}`);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    console.log(`url1 => ${BASE_URL}${pmid}`)
    superagent.get(`${BASE_URL}${pmid}`)
        .charset('utf-8')
        .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36')
        .end(function (err, sres) {
            if (err) {
                console.log('ERR: ' + err);
                res.json({
                    code: failCode,
                    msg: err,
                    data: {
                    }
                });
                return;
            }
            const $ = cheerio.load(sres.text, {
                decodeEntities: false
            });
            // const mainBody = $('div#article-details');
            const doi = $("span.doi  a").first().text().trim();
            if(doi.length > 0) {
                console.log(`url2 => ${API_CROSSREF}${doi}`)
                superagent.get(`${API_CROSSREF}${doi}`)
                    .charset('utf-8')
                    .type('application/json')
                    .end(function (err, sres) {
                        if (err) {
                            console.log('ERR: ' + err);
                            res.json({
                                code: failCode,
                                msg: err,
                                data: {
                                }
                            });
                            return;
                        }
                        const result = JSON.parse(sres.text);
                        const author_info = result.message.author;
                        const organization_list = author_info.filter(a => a.name);
                        const author_list = author_info.filter(a => a.given);
                        // TODO: 解析 doi 查询网页
                        try {
                            res.json({
                                code: successCode,
                                msg: "",
                                data: {
                                    'doi': doi.trim(),
                                    'pmid': pmid,
                                    'arxiv_id': '',
                                    'origin_url': result.message.URL,
                                    'title': result.message.title[0].trim(),
                                    'author': author_list.map(x => `${x.given} ${x.family}`),
                                    'organization': organization_list.map(x => x.name),
                                    'magazine': result.message['container-title'],
                                    'publisher': result.message.publisher,
                                    'publication_year': result.message.indexed['date-parts'][0][0],
                                    'category': result.message.subject,
                                    'research_area': '',
                                    'issue_description': ''
                                }
                            });
                        } catch(err){
                            console.log('ERR: ' + err);
                            res.json({
                                code: failCode,
                                msg: err,
                                data: {
                                }
                            });
                            return;
                        }
                });
            }else {
                // TODO: 解析 pmid 查询网页
                try {
                    res.json({
                        code: successCode,
                        msg: "",
                        data: {
                            'doi': $("span.doi  a").text(),
                            'pmid': pmid,
                            'arxiv_id': '',
                            'origin_url': `${BASE_URL}${pmid}`,
                            'title': $("h1.heading-title").first().text(),
                            'author': $("div.authors-list > span.authors-list-item > a").text(),
                            'organization': '',
                            'magazine': $('button#full-view-journal-trigger').attr('title'),
                            'publisher': '',
                            'publication_year': '',
                            'category': '',
                            'research_area': '',
                            'issue_description': ''
                        }
                    });
               } catch(err){
                    console.log('ERR: ' + err);
                    res.json({
                        code: failCode,
                        msg: err,
                        data: {
                        }
                    });
                    return;
               }
            }
        });
};