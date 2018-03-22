const url = `https://jsonplaceholder.typicode.com/posts`;

const getUrlParams = (search = ``) => {
    const hashes = search.slice(search.indexOf(`?`) + 1).split(`&`)
    return hashes.reduce((acc, hash) => {
        const [key, val] = hash.split(`=`)
        acc[key] = val
        return acc
    }, {})
}

const renderPosts = (json) => {
    let $posts = document.createElement("ul");
    $posts.className = "posts"
    
    json.forEach(element => {
        let $li = document.createElement("li");
        let $a = document.createElement("a");
        $li.appendChild($a)
        
        $a.textContent = element.title;
        $a.setAttribute('href', `${location}?postId=${element.id}`)

        $posts.appendChild($li);
    });

    document.body.appendChild($posts)
}

const renderPost = (jsonPost, jsonComments) => {
    if ('content' in document.createElement('template')) {

        let $template = document.querySelector('#template-post');
  
        $template.content.querySelector("h2").textContent = jsonPost.title;
        $template.content.querySelector("p").textContent = jsonPost.body;

        jsonComments.forEach(comment => {
            let $divComment = document.createElement('div');
            $divComment.className = 'comment';

            $template.content.querySelector(".comments").innerHTML += `
                <div class="comment">
                    <h4 class="name-comment">${comment.name}</h4>
                    <p class="blog-comment">${comment.body}</p>
                </div>
            `
        })

        let clone = document.importNode($template.content, true);
        document.body.appendChild(clone)
    }   
}

if (window.location.search) {

    let urlParams  = getUrlParams(window.location.search);

    if (urlParams.postId) {
        let jsonPost;
        fetch(url + '/' + urlParams.postId)
            .then(response => response.json())
            .then(json => {
                jsonPost = json;
                return fetch(`${url}/${urlParams.postId}/comments`);
            })
            .then(response => response.json())
            .then(json => renderPost(jsonPost, json))  
  
    } else if (urlParams.userId) {
        fetch(url + '?userId=' + urlParams.userId)
            .then(response => response.json())
            .then(json => renderPosts(json))    
    }    
} else {
    fetch(url)
        .then(response => response.json())
        .then(json => renderPosts(json))
}
