(procedure
  body: (block) @function.inside) @function.around

(entrypoint
  body: (block) @function.inside) @function.around

(moduledoc (doc_comment)+ @comment.inside)
(doc_comment)+ @comment.around
(comment)+ @comment.around
