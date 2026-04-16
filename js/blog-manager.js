(function () {
  var STORAGE_KEY = 'neotech_uploaded_posts';

  function getStoredPosts() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function setStoredPosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function savePostFromForm(form) {
    var formData = new FormData(form);
    var title = String(formData.get('blog-title') || '').trim();
    var category = String(formData.get('blog-category') || 'General').trim();
    var excerpt = String(formData.get('blog-excerpt') || '').trim();

    if (!title) {
      return false;
    }

    var post = {
      id: Date.now(),
      title: title,
      category: category || 'General',
      excerpt: excerpt,
      createdAt: new Date().toISOString()
    };

    var posts = getStoredPosts();
    posts.unshift(post);

    if (posts.length > 25) {
      posts = posts.slice(0, 25);
    }

    setStoredPosts(posts);
    return true;
  }

  function renderUploadedPosts() {
    var list = document.getElementById('latest-articles-list');
    if (!list) {
      return;
    }

    var posts = getStoredPosts();

    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];
      var item = document.createElement('li');
      item.className = 'js-uploaded-post';

      var link = document.createElement('a');
      link.href = 'blog.html#upload-success';
      link.textContent = 'Uploaded: ' + post.title + ' (' + post.category + ')';

      item.appendChild(link);

      if (post.createdAt) {
        var timestamp = document.createTextNode(' - ' + formatDate(new Date(post.createdAt)));
        item.appendChild(timestamp);
      }

      list.insertBefore(item, list.firstChild);
    }
  }

  function bindUploadForm(formId) {
    var form = document.getElementById(formId);
    if (!form) {
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      var saved = savePostFromForm(form);
      if (!saved) {
        return;
      }

      window.location.href = 'blog.html#upload-success';
    });
  }

  bindUploadForm('blog-upload-form');
  bindUploadForm('blog-upload-inline-form');
  renderUploadedPosts();
})();
