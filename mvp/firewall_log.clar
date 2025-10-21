(define-map event-log
  ((hash uint)) ; key: hash of event
  ((prev uint)))

(define-public (anchor (hash uint))
  (let ((prev (unwrap! (map-get? event-log (tuple (hash hash))) u0)))
    (map-set event-log (tuple (hash hash)) (tuple (prev prev)))
    (ok true)))

(define-read-only (get-prev (hash uint))
  (match (map-get? event-log (tuple (hash hash)))
    entry (ok (get prev entry))
    (ok u0)))
