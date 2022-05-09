const decrypt = require('./decrypt.js');
const cheerio = require('cheerio')
const iconv = require('iconv-lite');

class Book {
    constructor(html) {
        this.name = name;
        this.age = age;
    }

    getInfo() {
        return this.name + ':' + this.age;
    }
}


function read_file(file_path, data) {
    return require('fs').readFileSync(file_path, 'utf8');
}


const novel_id = "29312"


function catalogue(error, response, body) {
    var html = iconv.decode(body, 'gb2312')
    console.log(html)
    var book_name = html.match(/<p><a>(.*?)<\/a><span>/)[1]
    console.log(book_name)
    var chapter_id_list = []
    html = html.split('<li><a href="')
    for (let i = 0; i < html.length; i++) {
        if (html[i].indexOf(".html\" title=") !== -1) {
            if (html[i].length <= 100) {
                chapter_id_list.push(html[i].split('.html" title="')[0])
            }
        }
    }
    for (let i = 0; i < chapter_id_list.length; i++) {
        var chapter_url = "https://m.feiszw.com/chapter-" + novel_id + "-" + chapter_id_list[i] + "/"
        // console.log(chapter_url)
        get(chapter_url, "content")
    }
    if (!error && response.statusCode === 200) {
        // const $ = cheerio.load(iconv.decode(body, 'gbk'));
        console.log(body.match(/<li><a href=(\S*)ul>/g))

    } else {
        console.log(error)
    }
}


function content(error, response, body) {
    if (!error && response.statusCode === 200) {
        let encryption_content
        var title = body.match(/class="nr_title">(.*?)<\/div>/)[1]
        console.log(title + "下载完毕")
        try {
            encryption_content = decrypt.base64decrypt(decrypt.c6(
                decrypt.base64decrypt(body.match(/Content='(.*?)'/)[1]), body.match(/update='(.*?)'/)[1]
            ))
        } catch (err) {
            // console.error(err)
            return
        }
        const content_html = decodeURIComponent(escape(encryption_content)).replace(/<[^>]+>/g, "\n")
        const content_lines = content_html.split("\n")
        write_file("./cs.txt", "\n\n\n" + title + "\n", "a")
        for (let i = 0; i < content_lines.length; i++) {
            if (content_lines[i] !== "") {
                write_file("./cs.txt", content_lines[i] + "\n", "a")
            }
        }
    } else {
        console.log(error)
    }
}

function write_file(file_path, content, mode) {
    if (mode === "w") {

        try {
            return require('fs').writeFileSync(file_path, content)
            //文件写入成功。
        } catch (err) {
            console.error(err)
        }
    } else if (mode === "a") {
        try {
            require('fs').appendFileSync(file_path, content)
        } catch (err) {
            console.error(err)
        }
    }
}


function get(url, tool) {
    const headers = {
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)',
        'Content-Type': ' text/html; charset=utf-8'
    };
    if (tool === "content") {
        return require('request')({url: url, headers: headers}, content);
    } else if (tool === "catalogue") {
        return require('request')({url: url, headers: headers}, catalogue);
    }
}

get("https://www.feiszw.com/Html/29312/index.html", "catalogue")
