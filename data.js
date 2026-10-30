window.GAS_DATA = (() => {
  const resources = [
    { id: '01', videoId: '9O4pyLaPO60', title: 'Use “Shape Language” for BETTER Character Designs', creator: 'KeshArt', duration: '02:05', kind: 'lesson', level: 'easy', tags: ['character', 'creative'], micro: '把同一个小生物画成圆形版、方形版和三角形版，比较它们给人的感觉。' },
    { id: '02', videoId: '4LhRN9HMEW8', title: 'How to Draw ANY Pose You Want (The Easy way)', creator: 'KeshArt', duration: '02:35', kind: 'lesson', level: 'easy', tags: ['character'], micro: '先用三条不同的动作线，再给角色加上简单的头与身体。' },
    { id: '03', videoId: 'TYa-qmL6XUs', title: 'Drawing Simple Clear Facial Expressions', creator: 'The Art of Aaron Blaise', duration: '22:25', kind: 'demo', level: 'explore', tags: ['character', 'creative'], micro: '画同一只动物的四种心情，观察眼睛、眉毛和嘴巴怎样一起变化。' },
    { id: '04', videoId: 'SYnCOvHYVYY', title: 'DRAW THIS, NOT THAT! Fixing Boring Facial Expressions', creator: 'LavenderTowne', duration: '12:04', kind: 'lesson', level: 'easy', tags: ['character', 'creative'], micro: '给自己的角色画出两种完全不同的“惊讶”表情。' },
    { id: '05', videoId: 'JND4GykvMiA', title: 'How to draw animal characters', creator: 'Mitch Leeuwe', duration: '05:59', kind: 'lesson', level: 'easy', tags: ['observation', 'character'], micro: '先用圆和椭圆搭出动物，再改变耳朵、尾巴和身体比例。' },
    { id: '06', videoId: '8GYwNmANBFU', title: "Don't Draw HEADS Like This!", creator: 'Winged Canvas', duration: '05:04', kind: 'lesson', level: 'easy', tags: ['observation', 'character'], micro: '让一个角色分别向左、向右、向上、向下看，观察五官的位置。' },
    { id: '07', videoId: 'BiAyR8nw9EI', title: 'Drawing animal heads in animation style', creator: 'Mitch Leeuwe', duration: '11:10', kind: 'demo', level: 'explore', tags: ['character'], micro: '画一只侧头闻花的动物，注意鼻子与耳朵的前后关系。' },
    { id: '08', videoId: 'c8s6Md4RXqg', title: 'Drawing - Creating Animal Characters', creator: 'The Art of Aaron Blaise', duration: '19:11', kind: 'demo', level: 'explore', tags: ['observation', 'character'], micro: '从一张真实动物照片中找两个特征，再创造自己的角色。' },
    { id: '09', videoId: 'UOC8ISSbFx0', title: '5 BEGINNER Drawing Exercises to IMPROVE Fast', creator: 'KeshArt', duration: '06:17', kind: 'lesson', level: 'easy', tags: ['observation'], micro: '画几条线、几个简单形状，再把它们组合成一种新东西。' },
    { id: '10', videoId: '9Am25gRp_4w', title: 'Whimsical Watercolor Birds for Beginners', creator: 'Diane Antone Studio', duration: '22:03', kind: 'demo', level: 'explore', tags: ['color'], materials: '水彩纸、水彩颜料', micro: '用三个彩色水渍创造不同的小鸟或幻想生物。' },
    { id: '11', videoId: 's42NgD6PHNo', title: 'EASY Watercolor Line and Wash Puppy Tutorial', creator: 'Emily Olson Art', duration: '25:12', kind: 'demo', level: 'explore', tags: ['color'], materials: '水彩纸、画笔、水彩颜料', micro: '画一只小动物，试一试线条与柔和水彩怎样配合。' },
    { id: '12', videoId: 'i0x8VUsk_zE', title: '1 WATERCOLOR CHALLENGE - I Chose THAT Color... Really?', creator: 'Kasey The Golden', duration: '10:18', kind: 'inspiration', level: 'imagine', tags: ['color', 'creative'], materials: '水彩颜料', micro: '抽一个颜色，用深浅变化画出属于自己的小场景。' },
    { id: '13', videoId: 'tVynETvms-o', title: 'Tips for Drawing Backgrounds!', creator: 'BaM Animation', duration: '14:45', kind: 'demo', level: 'explore', tags: ['space', 'creative'], micro: '给角色加上前景和远景，观察故事感是否改变。' },
    { id: '14', videoId: 'qOojGBEsWQw', title: 'How to Draw a Room in 1-Point Perspective', creator: 'Circle Line Art School', duration: '10:04', kind: 'lesson', level: 'explore', tags: ['space'], micro: '先画一个房间框架，再把它变成秘密基地或树屋。' },
    { id: '15', videoId: 'H5qwphbrgTA', title: "How to Draw a City using One-Point Perspective: Bird's Eye View", creator: 'Circle Line Art School', duration: '09:13', kind: 'demo', level: 'explore', tags: ['space'], micro: '想象从飞行器上俯瞰一座城市，把自己的秘密角落藏进去。' },
    { id: '16', videoId: 'bTntk6_PLyA', title: 'Drawing in Perspective Without Using Rulers!', creator: 'markcrilley', duration: '15:01', kind: 'demo', level: 'explore', tags: ['space'], micro: '徒手画一条远去的小路，让沿途物体渐渐变小。' },
    { id: '17', videoId: '8wm9ti-gzLM', title: 'GOOD vs BAD Character Design', creator: 'BaM Animation', duration: '20:21', kind: 'demo', level: 'explore', tags: ['character', 'creative'], micro: '设计两个轮廓差异明显的角色，试试只看剪影能否分辨。' },
    { id: '18', videoId: 'skVmmOhO6Vc', title: 'Breaking the Rules of COMPOSITION for More Interesting Art', creator: 'Winged Canvas', duration: '16:45', kind: 'demo', level: 'explore', tags: ['space', 'creative'], micro: '把主角画在画面中央和角落各一次，比较效果。' },
    { id: '19', videoId: 'EXiTX-5vqEM', title: 'Fixing My Old Artwork', creator: 'Moriah Elizabeth', duration: '16:57', kind: 'inspiration', level: 'imagine', tags: ['creative'], micro: '从自己的一张旧画里保留两点喜欢的部分，再改变一个地方。' },
    { id: '20', videoId: 'c72cvxSqots', title: 'SUPERHERO TEAM - Random Character Design Challenge', creator: 'Jazza', duration: '15:14', kind: 'inspiration', level: 'imagine', tags: ['creative'], micro: '抽取一个角色、一个特征和一个动作，画三张不同草图。' }
  ];

  const skills = [
    { id: 'observation', name: '观察与造型', en: 'Observation & Form', icon: '◌', tone: 'sage', question: '我看见了什么？怎么用简单形状画出来？', description: '线条、形状、从真实世界里发现绘画结构。', featured: '09' },
    { id: 'character', name: '角色与动态', en: 'Characters & Motion', icon: '✦', tone: 'coral', question: '怎样让自己的角色更有个性、动起来？', description: '动物、人物、身体比例、表情与姿势。', featured: '05' },
    { id: 'space', name: '空间与场景', en: 'Space & Scene', icon: '▱', tone: 'lavender', question: '怎样让角色走进一个真实又神奇的世界？', description: '前后层次、房间、透视、背景与构图。', featured: '13' },
    { id: 'color', name: '色彩与媒材', en: 'Color & Media', icon: '◒', tone: 'butter', question: '颜色和画材会带来怎样的变化？', description: '水彩、留白、色块、线条与颜色。', featured: '10' },
    { id: 'creative', name: '创意与叙事', en: 'Creativity & Story', icon: '✧', tone: 'rose', question: '一张画怎样让别人读出一个故事？', description: '个性、情绪、角色组合与创作挑战。', featured: '20' }
  ];

  const lessons = {
    '09': {
      title: '让笔动起来！', sub: 'Lines · Shapes · Shape Combinations', tag: '观察与造型', time: '约 15–20 分钟', materials: '白纸、铅笔',
      question: '画复杂东西之前，能不能先用几根线和几个简单形状，把想法画出来？',
      notice: ['作者怎样先画线、再画形状、再把形状组合？', '这次只挑你最想试的两三种练习即可。'],
      steps: ['画3条不同的线：直线、弯线、波浪线。', '再画3个形状：圆、三角形、长方形。', '只用这些线和形状，拼出一个你能叫出名字的东西。'],
      creative: '任选“会飞的书包”“会跳舞的茶壶”或者你的小怪兽，先用3个大形状搭框架，再添细节。',
      hints: ['暂时不画眼睛、花纹，你还能认出它像什么吗？', '先画一个很大的圆作为主体，再在外面加两个三角形或四边形，边画边决定它是什么。'],
      reflect: '今天哪一次把两个形状组合起来，产生了你没想到的东西？',
      success: '你愿意先从线和形状开始，而不是一直困在空白纸前。',
      terms: [['Lines', '线条'], ['Shapes', '形状'], ['Shape Combinations', '形状组合']],
      next: ['01', '05'],
      chapters: [['00:09', '线条 Lines'], ['01:43', '形状 Shapes'], ['02:43', '形状组合 Shape Combos'], ['03:27', '立体与有机形'], ['04:30', '形状拆解']]
    },
    '01': {
      title: '圆脑袋和尖脑袋，性格会不同吗？', sub: 'Shape Language · Silhouette', tag: '角色与动态', time: '约 15–20 分钟', materials: '白纸、铅笔',
      question: '如果把同一个角色画成圆、方、尖三种外形，别人对它的印象会不同吗？',
      notice: ['先观察角色的大轮廓，再看细节。', '形状没有固定的“好人或坏人”答案，重要的是你的设计意图。'],
      steps: ['画三个小框，分别用圆、方、三角为主设计同一种生物。', '给三种角色加上相似的简单五官。', '看看哪一种最符合你想象的个性。'],
      creative: '设计一个“看起来凶，其实特别温柔”的角色，试着混合圆形和尖角，让外形与性格形成惊喜反差。',
      hints: ['只看外轮廓，你会用什么词形容它？', '画圆胖肚子，再给它长而尖的耳朵。现在它更像什么？'],
      reflect: '我希望别人先注意这个角色的哪个特点？我怎样把它放大了？',
      success: '你画出了至少两种不同轮廓，并发现形状选择会影响角色感觉。',
      terms: [['Shape Language', '形状语言'], ['Silhouette', '剪影'], ['Exaggeration', '夸张']],
      next: ['05', '02']
    },
    '05': {
      title: '把圆形和椭圆形变成一只动物！', sub: 'Construction · Proportion · Character Design', tag: '角色与动态', time: '约 15–25 分钟', materials: '白纸、铅笔',
      question: '不从眼睛和耳朵这些细节开始，能不能只用大形状先画出动物？',
      notice: ['动物的头、身体和四肢如何先用简单形状组合？', '只改变头和身体的比例，角色感觉会有什么不同？'],
      steps: ['画一个圆形的头，再加上椭圆形的身体。', '加上简单的四肢或最明显的耳朵、尾巴。', '再画一次，只改变头和身体的大小比例。'],
      creative: '先画一只真实动物，然后创造它的幻想版本。你可以让耳朵很大、尾巴发光，或者让它有特别的能力，再给它起个名字。',
      hints: ['你最希望别人一眼认出的特征是什么：耳朵、嘴巴，还是尾巴？', '先画小圆＋大椭圆，再加两条腿和一种特别明显的耳朵或尾巴。'],
      reflect: '我保留了真实动物的哪个特征？又创造了哪个新特征？',
      success: '你能先画大结构，并主动修改一处比例或外形。',
      terms: [['Construction', '结构搭建'], ['Proportion', '比例'], ['Character Design', '角色设计']],
      next: ['01', '02']
    },
    '02': {
      title: '让我的角色跳起来！', sub: 'Pose · Gesture · Line of Action', tag: '角色与动态', time: '约 15–20 分钟', materials: '白纸、铅笔',
      question: '为什么有些角色站着很有趣，动起来却像木头？',
      notice: ['先想整个身体的运动方向，不急着画手指和衣服。', '动作线怎样帮助姿势更自然、更有力量？'],
      steps: ['用三条不同的弧线表现“跳起来”“躲闪”“突然停住”。', '在其中两条线上加简单的头和身体。', '比较哪一个动作更容易让人猜出来。'],
      creative: '给自己的动物或人物画一个动作小故事：追蝴蝶、跳水坑或滑滑板。让动作方向比细节更明显。',
      hints: ['遮住五官，只看身体方向，别人能猜出它在做什么吗？', '先画一条大弧线，再把头圆、身体椭圆挂在上面，最后加四肢。'],
      reflect: '把哪条线弯得更厉害之后，角色终于像真的在动了？',
      success: '你尝试了两种明显不同的动作，不需要解剖学准确。',
      terms: [['Pose', '姿势'], ['Gesture', '动态速写'], ['Line of Action', '动作主线']],
      next: ['04']
    },
    '04': {
      title: '同样是惊讶，可以画出两种心情吗？', sub: 'Facial Expression · Eyebrows · Exaggeration', tag: '角色与动态', time: '约 20–30 分钟', materials: '白纸、铅笔',
      question: '两个角色都张大嘴巴，为什么一个像惊喜，另一个像害怕？',
      notice: ['眼睛、眉毛、嘴巴怎样组合表达情绪？', '允许边看边暂停，不用一次看完12分钟。'],
      steps: ['画两张完全相同的圆脸。', '一张表示“收到惊喜”，另一张表示“发现可怕的东西”。', '只改眉毛、眼睛和嘴巴，看它们有何不同。'],
      creative: '给前面设计的小动物画一个两格故事：先发现秘密，再做出反应。试试不写字也让别人读懂心情。',
      hints: ['只改嘴巴而不改眼睛、眉毛，还能看出两种情绪吗？', '试试抬高眉毛、睁大眼睛；再试试紧张的眉毛和缩起来的身体。这只是可能的画法。'],
      reflect: '今天最能让别人读懂情绪的，是哪一个小变化？',
      success: '你能用五官组合画出两种可辨认的情绪。',
      terms: [['Facial Expression', '面部表情'], ['Eyebrows', '眉毛'], ['Exaggeration', '夸张']],
      next: ['13']
    }
  };

  const creators = [
    ['KeshArt', '短小的基础技巧与角色实验，适合拿起笔马上试。'],
    ['The Art of Aaron Blaise', '从动物的观察和动作走向有生命力的角色。'],
    ['Mitch Leeuwe', '把复杂动物与角色拆成可以理解的基本形状。'],
    ['Winged Canvas', '用清晰示例理解头部、角色结构与构图。'],
    ['BaM Animation', '从动画角度分析角色设计、背景与故事表达。'],
    ['Circle Line Art School', '用直观线条学习房间、城市和透视空间。'],
    ['Diane Antone Studio', '用水彩和轻松的色块创造小动物。'],
    ['Kasey The Golden', '从画材和限制条件中发现有趣的创意。'],
    ['LavenderTowne', '有趣的卡通表情和视觉对比练习。'],
    ['Emily Olson Art', '以具体的小动物主题演示线条与水彩。'],
    ['markcrilley', '徒手表现漫画式的空间与远近关系。'],
    ['Moriah Elizabeth', '从旧画改造与创作挑战中寻找灵感。'],
    ['Jazza', '角色设计和大胆的随机创意挑战。']
  ].map(([name, description]) => ({ name, description }));

  const books = [
    { name: 'How to THINK When You Draw', by: 'The Etherington Brothers', type: '免费图解', desc: '官方免费图解目录：从各种物品的形状开始学习“怎样想”。英文图解，适合按兴趣挑选。', url: 'https://theetheringtonbrothers.blogspot.com/p/every-how-to-think-when-you-draw.html' },
    { name: 'Creating Characters with Personality', by: 'Tom Bancroft', type: '纸质／电子书', desc: '角色个性与造型设计的深入参考书，暂不要求 Grace 独立通读或购买。', url: 'https://www.penguinrandomhouse.com/books/8114/creating-characters-with-personality-by-tom-bancroft-introduction-by-glen-keane/' },
    { name: 'How to Draw Animals', by: 'Mitch Leeuwe', type: '付费扩展参考', desc: '动画风格动物绘画课程与图解，网站学习不以购买为前提。', url: 'https://www.mitchleeuwe.nl/' }
  ];

  const observationTasks = [
    { title: '同一个玩具，三个角度', icon: '◌', desc: '把一个小玩具放在桌上，从正面、侧面和上方分别画三个小草图。', reflect: '哪一面让你发现了之前没注意到的形状？' },
    { title: '先凭记忆，再仔细观察', icon: '✎', desc: '先凭记忆画一个熟悉的物品，再对着实物画一次，找出两个新发现的细节。', reflect: '你第一次遗漏了什么？为什么？' },
    { title: '三分钟街景速写', icon: '▱', desc: '看看窗外或者在户外，快速画出前景、中景和远景，再把它卡通化。', reflect: '哪些东西离你最近？你是怎么画出来的？' }
  ];

  const project = [
    { title: '它是谁？', lesson: '05', desc: '从简单形状开始，创造一只幻想动物。', output: '一张动物角色草图' },
    { title: '它有什么个性？', lesson: '01', desc: '用不同外形，让角色显出独特性格。', output: '同一角色的两种外形' },
    { title: '它会做什么？', lesson: '02', desc: '画它跳跃、奔跑或发现新东西。', output: '一个有动作的角色' },
    { title: '它心里在想什么？', lesson: '04', desc: '让它的惊喜、害怕或好奇被看出来。', output: '两种不同的情绪' },
    { title: '它经历了什么？', lesson: null, desc: '只用两格画面，让角色经历一个小故事。', output: '一张没有标准答案的两格漫画' }
  ];

  const prompts = {
    characters: ['小狐狸', '小刺猬', '企鹅', '小兔子', '猫头鹰', '小龙', '章鱼', '蜜蜂', '会说话的云朵', '小机器人', '玩具熊', '会走路的茶壶'],
    traits: ['一条超长围巾', '透明的小翅膀', '一只特别大的耳朵', '会发光的鞋子', '装满星星的口袋', '蘑菇帽子', '彩虹尾巴', '怕黑却很勇敢', '一紧张就变颜色', '头顶一株小植物', '总拿着小地图', '影子有自己的想法'],
    actions: ['参加森林音乐会', '在雨中找丢失的东西', '第一次学骑车', '穿过云朵桥', '给朋友送生日惊喜', '试图藏起一个秘密', '进入会移动的房间', '帮助一颗星星回家', '当一天邮递员', '在图书馆值日', '和影子比赛跑步', '开一家动物晚餐餐厅']
  };

  return { resources, skills, lessons, creators, books, observationTasks, project, prompts };
})();
