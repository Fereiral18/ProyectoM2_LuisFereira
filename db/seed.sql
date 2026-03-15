INSERT INTO authors (name, email, bio) VALUES
('Alejandra Gomez', 'alejandra.gomez@gmail.com', 'Desarrolladora backend especializada en Python y Django'),
('Facundo Molina', 'facundo.molina@gmail.com', 'Ingeniero de software con enfoque en arquitecturas escalables y microservicios'),
('Camila Herrera', 'camila.herrera@gmail.com', 'Frontend developer apasionada por React, Vue y experiencia de usuario'),
('Sebastian Paz', 'sebastian.paz@gmail.com', 'DevOps engineer con experiencia en AWS, Docker y CI/CD'),
('Luciana Rios', 'luciana.rios@gmail.com', 'Desarrolladora mobile especializada en React Native y Flutter');

INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Introducción a Django REST Framework', 'DRF permite crear APIs robustas en Python de manera rápida y con buenas prácticas. Te muestro cómo empezar.', true),
(1, 'Optimización de consultas en Django', 'El uso select_related y prefetch_related puede mejorar drásticamente el rendimiento de tus aplicaciones Django.', true),
(2, 'Patrones de diseño en microservicios', 'Circuit breaker, API gateway y service discovery son patrones clave para arquitecturas distribuidas.', true),
(2, 'Manejo de transacciones distribuidas', 'Cómo mantener la consistencia en sistemas con múltiples bases de datos usando el patrón Saga.', true),
(3, 'Estado global en React con Zustand', 'Alternativa liviana a Redux para manejar el estado en aplicaciones React modernas.', true),
(3, 'Renderizado del lado del servidor con Next.js', 'Ventajas del SSR para SEO y rendimiento en aplicaciones React.', true),
(4, 'Dockerizar aplicaciones en Node.js', 'Guía paso a paso para crear Dockerfiles eficientes para tus proyectos Node.js.', true),
(4, 'Pipeline CI/CD con GitHub Actions', 'Automatiza el testing y deploy de tus aplicaciones usando GitHub Actions.', true),
(5, 'Navegación en React Native', 'Comparativa entre React Navigation y React Native Navigation para tus apps mobile.', true),
(5, 'Widgets personalizados en Flutter', 'Cómo crear componentes reutilizables y optimizar el rendimiento en Flutter.', true);