const superagent = require('superagent');
const charset = require('superagent-charset');
charset(superagent);
// const cheerio = require('cheerio');
const API_CROSSREF = "https://api.crossref.org/v1/works/";
// const DX_DOI = "https://dx.doi.org/";
const successCode = 'OK';
const failCode = 'ERROR';


module.exports = (req, res) => {
    const doi = req.body.doi;
    console.log(`request => ${doi}`);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    console.log(`url => ${API_CROSSREF}${doi}`)
    superagent.get(`${API_CROSSREF}${doi}`)
        .charset('utf-8')
        .set('Accept', 'application/json')
        .type('application/json')
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
                        'doi': doi,
                        'pmid': '',
                        'arxiv_id': '',
                        'origin_url': result.message.URL,
                        'title': result.message.title[0],
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
            } catch (err) {
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
};