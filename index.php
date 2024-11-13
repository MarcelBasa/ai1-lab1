<?php

// Komentarz modelowy
class Comment {
    public $id;
    public $postId;
    public $author;
    public $content;
    public $createdAt;

    public function __construct($id, $postId, $author, $content, $createdAt) {
        $this->id = $id;
        $this->postId = $postId;
        $this->author = $author;
        $this->content = $content;
        $this->createdAt = $createdAt;
    }
}

class CommentService {
    private $comments = [];

    public function __construct() {
        // Przykładowe dane
        $this->comments[] = new Comment(1, 1, 'User1', 'Nice post!', '2023-11-10');
        $this->comments[] = new Comment(2, 1, 'User2', 'I agree!', '2023-11-11');
    }

    public function getAll() { return $this->comments; }

    public function getById($id) {
        foreach ($this->comments as $comment) {
            if ($comment->id == $id) return $comment;
        }
        return null;
    }

    public function create($postId, $author, $content) {
        $newComment = new Comment(count($this->comments) + 1, $postId, $author, $content, date('Y-m-d H:i:s'));
        $this->comments[] = $newComment;
        return $newComment;
    }

    public function update($id, $content) {
        $comment = $this->getById($id);
        if ($comment) {
            $comment->content = $content;
            return $comment;
        }
        return null;
    }

    public function delete($id) {
        foreach ($this->comments as $index => $comment) {
            if ($comment->id == $id) {
                unset($this->comments[$index]);
                return true;
            }
        }
        return false;
    }
}

$action = $_REQUEST['action'] ?? null;
$commentService = new CommentService();
$view = '';

switch ($action) {
    case 'comment-list':
        $comments = $commentService->getAll();
        $view .= "<h2>Lista komentarzy</h2><ul>";
        foreach ($comments as $comment) {
            $view .= "<li>{$comment->author}: {$comment->content} 
            - <a href='?action=comment-show&id={$comment->id}'>Pokaż</a>
            - <a href='?action=comment-edit&id={$comment->id}'>Edytuj</a>
            - <a href='?action=comment-delete&id={$comment->id}'>Usuń</a></li>";
        }
        $view .= "</ul><a href='?action=comment-create'>Dodaj komentarz</a>";
        break;

    case 'comment-show':
        $id = $_REQUEST['id'] ?? null;
        $comment = $commentService->getById($id);
        if ($comment) {
            $view .= "<h2>Komentarz</h2><p><strong>{$comment->author}</strong>: {$comment->content}</p>";
            $view .= "<a href='?action=comment-edit&id={$comment->id}'>Edytuj</a> | ";
            $view .= "<a href='?action=comment-delete&id={$comment->id}'>Usuń</a> | ";
            $view .= "<a href='?action=comment-list'>Wróć do listy</a>";
        } else {
            $view .= "Komentarz nie został znaleziony.";
        }
        break;

    case 'comment-create':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $postId = $_POST['postId'];
            $author = $_POST['author'];
            $content = $_POST['content'];
            $comment = $commentService->create($postId, $author, $content);
            header("Location: ?action=comment-show&id={$comment->id}");
            exit;
        }
        $view .= "<h2>Nowy Komentarz</h2>
                  <form method='POST'>
                      <input type='hidden' name='postId' value='1'>
                      Autor: <input type='text' name='author'><br>
                      Treść: <textarea name='content'></textarea><br>
                      <button type='submit'>Dodaj</button>
                  </form>";
        break;

    case 'comment-edit':
        $id = $_REQUEST['id'] ?? null;
        $comment = $commentService->getById($id);
        if (!$comment) {
            $view .= "Komentarz nie został znaleziony.";
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $content = $_POST['content'];
            $commentService->update($id, $content);
            header("Location: ?action=comment-show&id={$id}");
            exit;
        }

        $view .= "<h2>Edytuj Komentarz</h2>
                  <form method='POST'>
                      Treść: <textarea name='content'>{$comment->content}</textarea><br>
                      <button type='submit'>Zapisz</button>
                  </form>
                  <a href='?action=comment-list'>Wróć do listy</a>";
        break;

    case 'comment-delete':
        $id = $_REQUEST['id'] ?? null;
        if ($commentService->delete($id)) {
            header("Location: ?action=comment-list");
            exit;
        } else {
            $view .= "Komentarz nie został znaleziony.";
        }
        break;

    default:
        $view .= "<a href='?action=comment-list'>Pokaż listę komentarzy</a>";
        break;
}

echo $view;
?>
