<?php
// ملف قاعدة بيانات وهمية للاختبار
session_start();

// بيانات وهمية للبرامج
$demo_programs = [
    1 => [
        'id' => 1,
        'name' => 'Adobe Photoshop 2024',
        'description' => 'بەرنامەی دەستکاریکردنی وێنە کە زۆر بەکارهێنراوە',
        'version' => '25.0.0',
        'size' => '2.1 GB',
        'downloads' => 15420,
        'category' => 'Design',
        'mainCategory' => 'software',
        'image' => 'https://via.placeholder.com/150x150/0066cc/ffffff?text=PS',
        'downloadUrl' => 'https://example.com/download/photoshop',
        'videoUrl' => '',
        'created_at' => '2024-01-15 10:30:00'
    ],
    2 => [
        'id' => 2,
        'name' => 'Call of Duty: Modern Warfare',
        'description' => 'یارییەکی جەنگی بە گرافیکی بەرز',
        'version' => '1.5.2',
        'size' => '85 GB',
        'downloads' => 8750,
        'category' => 'Action',
        'mainCategory' => 'games',
        'image' => 'https://via.placeholder.com/150x150/cc0000/ffffff?text=COD',
        'downloadUrl' => 'https://example.com/download/cod',
        'videoUrl' => '',
        'created_at' => '2024-02-10 14:20:00'
    ]
];

// بيانات وهمية للتعليقات
$demo_comments = [
    1 => [
        [
            'id' => 1,
            'program_id' => 1,
            'text' => 'بەرنامەیەکی زۆر باشە، پێشنیارم دەکەیت',
            'author' => 'Ahmad',
            'rating' => 5,
            'created_at' => '2024-08-25 12:30:00'
        ],
        [
            'id' => 2,
            'program_id' => 1,
            'text' => 'کارکردنی خێرایە و بەکارهێنانی ئاسانە',
            'author' => 'Sara',
            'rating' => 4,
            'created_at' => '2024-08-26 09:15:00'
        ]
    ],
    2 => [
        [
            'id' => 3,
            'program_id' => 2,
            'text' => 'یارییەکی نایابە، زۆر حەزم لێیە',
            'author' => 'Omar',
            'rating' => 5,
            'created_at' => '2024-08-27 16:45:00'
        ]
    ]
];

// محاكاة اتصال قاعدة البيانات
class DemoConnection {
    public function prepare($query) {
        return new DemoStatement($query);
    }
    
    public function close() {
        // لا حاجة لإغلاق اتصال وهمي
    }
    
    public $insert_id = 0;
}

class DemoStatement {
    private $query;
    private $params = [];
    
    public function __construct($query) {
        $this->query = $query;
    }
    
    public function bind_param($types, ...$params) {
        $this->params = $params;
    }
    
    public function execute() {
        global $demo_programs, $demo_comments;
        
        if (strpos($this->query, 'SELECT * FROM programs WHERE id') !== false) {
            $id = $this->params[0];
            if (isset($demo_programs[$id])) {
                $this->result = new DemoResult([$demo_programs[$id]]);
            } else {
                $this->result = new DemoResult([]);
            }
        } elseif (strpos($this->query, 'SELECT * FROM comments WHERE program_id') !== false) {
            $program_id = $this->params[0];
            if (isset($demo_comments[$program_id])) {
                $this->result = new DemoResult($demo_comments[$program_id]);
            } else {
                $this->result = new DemoResult([]);
            }
        } elseif (strpos($this->query, 'INSERT INTO comments') !== false) {
            // محاكاة إضافة تعليق جديد
            global $conn;
            $conn->insert_id = rand(100, 999);
            $this->result = new DemoResult([]);
            return true;
        }
        
        return true;
    }
    
    public function get_result() {
        return $this->result;
    }
    
    public function close() {
        // لا حاجة لإغلاق statement وهمي
    }
}

class DemoResult {
    private $data;
    private $index = 0;
    
    public function __construct($data) {
        $this->data = $data;
    }
    
    public $num_rows;
    
    public function __get($name) {
        if ($name === 'num_rows') {
            return count($this->data);
        }
    }
    
    public function fetch_assoc() {
        if ($this->index < count($this->data)) {
            return $this->data[$this->index++];
        }
        return null;
    }
}

$conn = new DemoConnection();
?>

