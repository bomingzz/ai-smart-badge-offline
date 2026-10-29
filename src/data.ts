import { Insight, Skill, TimelineEvent, SOPStep, SOPStepItem, DeviceGroup, TraditionalClip } from './types';
export type { Skill, TraditionalClip, SOPStepItem };

export const mockDeviceGroups: DeviceGroup[] = [
  {
    id: 'g1',
    name: 'A区后厨 (A-Kitchen)',
    devices: [
      { id: 'd1', name: '主厨视角设备', status: 'online', battery: 84, model: 'Smart-Glass Pro', location: '冷作间', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop' },
      { id: 'd2', name: '备菜区监控', status: 'offline', battery: 0, model: 'Aura V1', location: '粗加工区', imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  {
    id: 'g2',
    name: 'B区配电房 (B-Electrical)',
    devices: [
      { id: 'd3', name: '巡检安全帽-01', status: 'warning', battery: 42, model: 'Smart-Glass Pro', location: '高压配电房', imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop' },
      { id: 'd4', name: '巡检安全帽-02', status: 'online', battery: 91, model: 'Smart-Glass Pro', location: '低压配电房', imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5eba2a29?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  {
    id: 'g3',
    name: '园区安保 (Security)',
    devices: [
      { id: 'd5', name: '夜巡记录仪-东门', status: 'online', battery: 100, model: 'Aura V2', location: '东侧外围', imageUrl: 'https://images.unsplash.com/photo-1497250681554-fc1adfc1b9ce?q=80&w=800&auto=format&fit=crop' }
    ]
  }
];

export const mockInsights: Insight[] = [
  {
    id: '1',
    title: '高危操作严重警报',
    description: "视觉系统检测到您在进行配电柜操作时，未正确执行挂牌(LOTO)并缺少左侧高压绝缘手套保护。请立即停止操作并穿戴防护装备！",
    type: 'alert',
    actionLabel: '查看安全规范',
  },
  {
    id: '2',
    title: 'SOP 执行偏离',
    description: '后厨标准化检测：冷作间的冷链生鲜处理时间已超出规定标准的 15 分钟底线，当前批次存在风险。建议立即标记。',
    type: 'insight',
    actionLabel: '开具报废凭证',
  },
  {
    id: '3',
    title: '识别到园区夜间安全巡检',
    description: '系统检测到您当前位于危险品仓储外围，环境光较低。强烈建议加载“夜间隐患排查雷达”以增强视觉对异常热源或化学泄漏的捕捉。',
    type: 'skill_recommendation',
    actionLabel: '加载异常雷达',
  }
];

export const mockSOPSteps: SOPStep[] = [
  {
    id: 'sop1',
    title: '断电隔离与锁扣 (LOTO)',
    status: 'passed',
    detail: '核验通过: 挂锁与个人标牌正确。',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sop2',
    title: '设置绝缘地垫与围挡',
    status: 'passed',
    detail: '核验通过: 绝缘垫位置正确合规。',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sop3',
    title: '穿戴高压绝缘个人防护(PPE)',
    status: 'failed',
    detail: '核验失败: 缺少高压绝缘手套，请立即补充！',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
    alertBox: '违规: 未佩戴绝缘手套'
  },
  {
    id: 'sop4',
    title: '验电与残余电荷释放',
    status: 'pending',
    detail: '等待当前步骤修正...'
  }
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: 't1',
    timestamp: '2026-07-17T10:30:00Z',
    timeLabel: '上午 10:30',
    type: 'video',
    summary: '高压电箱定检任务 (检出未佩戴绝缘手套违规)',
    detail: '视觉追踪报告：操作员执行 LOTO 锁扣挂牌正常，但在步骤二识别到左手缺少高压绝缘手套，触发零容忍违规告警，工单已自动下发整改。',
    tags: ['零容忍告警', '未戴绝缘手套', 'AI视觉核验'],
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&auto=format&fit=crop',
    sopId: 'ee',
    sopName: '高压电气定检 SOP',
    sopScore: 78,
    sopOverallStatus: 'warning',
    steps: [
      {
        id: 'ee-s1',
        stepNo: 1,
        title: '断电隔离与 LOTO 锁扣挂牌程序',
        sopStandard: '必须断开高压隔离刀闸，并在控制把手佩戴个人专属防操作蓝色锁扣与“有人工作”警告标牌，双人交叉核验。',
        aiEvidence: '视觉模型精确识别到蓝色 LOTO 挂锁落锁到位，标牌文字清晰对齐，挂牌停留动作达 3.2 秒，符合防误触操作标准。',
        status: 'passed',
        confidence: 99.8,
        timeRange: '10:30:05 - 10:30:22 (17s)',
        seekSeconds: 5,
        snapshotUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&auto=format&fit=crop',
        notes: '挂锁与警示牌无遮挡，视觉检测置信度 99.8%'
      },
      {
        id: 'ee-s2',
        stepNo: 2,
        title: '高压绝缘 PPE 防护服穿戴核验',
        sopStandard: '作业人员必须穿戴 20kV 绝缘手套、防爆绝缘面罩、绝缘安全靴，且手套无破损裂纹。',
        aiEvidence: '视觉多模态关键点识别警报：操作员在接触带电设备时，左手未穿戴 20kV 高压绝缘手套（严重违规），触发零容忍安全红线！系统已触发声光广播报警并生成紧急纠偏工单。',
        status: 'failed',
        confidence: 99.4,
        timeRange: '10:30:23 - 10:30:48 (25s)',
        seekSeconds: 23,
        snapshotUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
        notes: '防护手套材质与颜色光谱对比符合绝缘等级'
      },
      {
        id: 'ee-s3',
        stepNo: 3,
        title: '三相验电与残余电荷放电测试',
        sopStandard: '使用校准合格的高压验电器，对 A/B/C 三相接线端子逐一接触，观察验电声光提示音。',
        aiEvidence: '视频识别到验电棒依次接触三相接线柱，音频传感器同步捕获到规范低频脉冲蜂鸣声（74dB），确定系统无残留电压。',
        status: 'passed',
        confidence: 98.9,
        timeRange: '10:30:49 - 10:31:15 (26s)',
        seekSeconds: 49,
        snapshotUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
        notes: '音视频多模态协同核验通过'
      },
      {
        id: 'ee-s4',
        stepNo: 4,
        title: '配电箱盖板复位与现场封印闭环',
        sopStandard: '检修完毕将配电箱盖板复位，顺时针紧固 4 颗防松螺栓，拍照上传安监云端打包。',
        aiEvidence: '视觉定位到 4 枚螺栓均已固定，封印贴纸平整完好，现场无遗留螺丝刀等金属工具。图像数据打包写入分布式存储。',
        status: 'passed',
        confidence: 97.5,
        timeRange: '10:31:16 - 10:31:34 (18s)',
        seekSeconds: 76,
        snapshotUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
        notes: '工单已自动闭环，数据生成哈希摘要'
      }
    ]
  },
  {
    id: 't2',
    timestamp: '2026-07-17T08:45:00Z',
    timeLabel: '上午 08:45',
    type: 'audio',
    summary: '后厨晨间备菜日检',
    detail: '语音留档：“主厨查验汇报——冷区冰柜温度3度（正常），生熟砧板彻底分离，刀具系统消毒完毕。”',
    tags: ['食安监督', '多模态留档', '晨检合规'],
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
    audioDuration: '00:45',
    sopId: 'ck',
    sopName: '后厨晨间备菜 SOP',
    sopScore: 98,
    sopOverallStatus: 'passed',
    steps: [
      {
        id: 'ck-s1',
        stepNo: 1,
        title: '生熟砧板与刀具分类隔离规程',
        sopStandard: '红色切生肉砧板与绿色切蔬果/白色切熟食砧板物理距离 ≥ 1.5 米，刀具专板专用。',
        aiEvidence: '视觉语义分割识别到红色与绿色切配区距离为 1.85 米，刀具放置于专用消毒刀架，无交叉污染风险。',
        status: 'passed',
        confidence: 99.4,
        timeRange: '08:45:00 - 08:45:15 (15s)',
        seekSeconds: 0,
        snapshotUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
        notes: '砧板色标清晰，分区完好'
      },
      {
        id: 'ck-s2',
        stepNo: 2,
        title: '冷冰柜存温口述与数显表 OCR 验证',
        sopStandard: '冷藏柜温度须维持在 0-4℃ 之间，主厨口述汇报并指向数显仪表盘。',
        aiEvidence: '音频识别“冷区冰柜温度3度”，视觉 OCR 提取数字表盘“3.2℃”，语音与图像特征 100% 对齐匹配。',
        status: 'passed',
        confidence: 98.6,
        timeRange: '08:45:16 - 08:45:30 (14s)',
        seekSeconds: 16,
        snapshotUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop',
        notes: '语音与仪表数字一致性校验通过'
      },
      {
        id: 'ck-s3',
        stepNo: 3,
        title: '后厨人员口罩与网帽穿戴规范',
        sopStandard: '工作帽需严密包裹头发，口罩遮挡鼻梁与下巴，无外露首饰或长指甲。',
        aiEvidence: '人脸与姿态关键点检测：主厨口罩完全覆盖鼻梁，网帽无发丝外露，符合食品安全严格卫生规范。',
        status: 'passed',
        confidence: 99.1,
        timeRange: '08:45:31 - 08:45:45 (14s)',
        seekSeconds: 31,
        snapshotUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop',
        notes: '符合餐饮食安 GB-14881 卫生要求'
      }
    ]
  },
  {
    id: 't3',
    timestamp: '2026-07-17T07:15:00Z',
    timeLabel: '上午 07:15',
    type: 'context',
    summary: '消防通道违规占用检出',
    detail: '园区东侧二楼消防通道被装卸货物长时间占用，触发边缘侧抓拍打标，并自动派单至物业中心与安保部。',
    tags: ['隐患发现', '自动告警', '整改闭环'],
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
    sopId: 'sf',
    sopName: '园区消防通道 SOP',
    sopScore: 62,
    sopOverallStatus: 'warning',
    steps: [
      {
        id: 'sf-s1',
        stepNo: 1,
        title: '消防通道 2.4 米净空巡检规程',
        sopStandard: '消防主通道全天候严禁堆放任何纸箱、托盘、装卸货物或违停设备。',
        aiEvidence: '视觉模型识别到 3 堆木质托盘与装卸纸箱占用通道，实际剩余通行宽度 1.1 米（标准≥2.4米），判定为隐患占用。',
        status: 'failed',
        confidence: 99.6,
        timeRange: '07:15:00 - 07:15:10 (10s)',
        seekSeconds: 0,
        snapshotUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
        notes: '触发级别-1 级安全警报，自动触发派单'
      },
      {
        id: 'sf-s2',
        stepNo: 2,
        title: '边缘 AI 联动告警与工单自动下发',
        sopStandard: '检测到占用超 5 分钟，边缘网关须向园区安保中心与保洁主管发送急件工单。',
        aiEvidence: '系统于 07:15:12 生成整改工单 #WO-8821，喇叭播放“消防通道严禁堆物”提示音，保洁人员开始响应。',
        status: 'passed',
        confidence: 100.0,
        timeRange: '07:15:11 - 07:15:20 (9s)',
        seekSeconds: 11,
        snapshotUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
        notes: '工单下发延迟 < 800ms'
      },
      {
        id: 'sf-s3',
        stepNo: 3,
        title: '现场清理闭环与复核恢复净空',
        sopStandard: '责任人需在 15 分钟内彻底清理完毕，上传复核图像解除警报。',
        aiEvidence: '07:35:00 监控图像复核：占用货物已被搬离，通道恢复 2.5 米完整净空，警报自动解除闭环。',
        status: 'passed',
        confidence: 98.2,
        timeRange: '07:15:21 - 07:15:40 (19s)',
        seekSeconds: 21,
        snapshotUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&auto=format&fit=crop',
        notes: '隐患已消除，归档至月度安全台账'
      }
    ]
  },
  {
    id: 't4',
    timestamp: '2026-07-17T14:00:00Z',
    timeLabel: '下午 14:00',
    type: 'video',
    summary: '离散制造精密组装工序复核',
    detail: '全流程视觉防错审计：关键零部件二维码扫描校验无误，定扭矩扳手完成 5 点交错紧固，数值均在 45±2 N·m 标准区间，合规打包入库。',
    tags: ['智造质检', '力矩防错', '合格入库'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
    sopId: 'mf',
    sopName: '精密装配工序 SOP',
    sopScore: 96,
    sopOverallStatus: 'passed',
    steps: [
      {
        id: 'mf-s1',
        stepNo: 1,
        title: '零配件二维码扫描与物料防错匹配',
        sopStandard: '安装前使用眼镜摄像头对零件二维追溯码进行光感对焦，核对批次型号。',
        aiEvidence: '视觉模型实时解析物料二维码“PART-8821-C”，防错匹配成功，避免错装误装。',
        status: 'passed',
        confidence: 99.5,
        timeRange: '14:00:00 - 14:00:20 (20s)',
        seekSeconds: 0,
        snapshotUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
        notes: '零部件 BOM 对比一致'
      },
      {
        id: 'mf-s2',
        stepNo: 2,
        title: '定扭矩电动扳手五点交错紧固核验',
        sopStandard: '五螺栓盖板必须采用星形交错顺序紧固，目标扭矩 45 N·m。',
        aiEvidence: '姿态与工具轨迹对齐：识别到按 1-3-5-2-4 顺序依次对 5 枚螺栓进行交错加力，未漏拧。',
        status: 'passed',
        confidence: 98.7,
        timeRange: '14:00:21 - 14:00:50 (29s)',
        seekSeconds: 21,
        snapshotUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
        notes: '交错顺序与扭矩对齐通过'
      },
      {
        id: 'mf-s3',
        stepNo: 3,
        title: '光学防错传感器自动盖章留档',
        sopStandard: '装配完毕后，摄像头进行 3D 深度拟合测量，合格后上传品质云。',
        aiEvidence: '深度点云检测显示盖板缝隙≤0.1mm，品质结果“PASS”，工单自动完成离线归档。',
        status: 'passed',
        confidence: 99.0,
        timeRange: '14:00:51 - 14:01:10 (19s)',
        seekSeconds: 51,
        snapshotUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
        notes: '高精装配合规，生成合格质检单'
      }
    ]
  }
];

export const mockSkills: Skill[] = [
  { id: 's1', name: '后厨操作标准化视检引擎', description: '用于多维度监控切配分离、卫生着装合规、菜品存放超时等后厨核心 SOP 指标。', category: 'Compliance', isActive: true },
  { id: 's2', name: '高危电工作业安全审计', description: '极低延迟防护检测模块，高频捕捉电工作业的防护装备穿戴及 LOTO 流程规范。', category: 'Safety', isActive: true },
  { id: 's3', name: 'AI 园区全景巡检雷达', description: '整合红外与低光增强技术，针对园区动态追踪识别违停、起火点、物料违规堆积等隐患。', category: 'Safety', isActive: false, recommended: true },
  { id: 's4', name: '设施维修专家远程协同', description: '开启第一视角极清音视频流与 AR 标注支持，连线云端专家库工程师远程处理设备故障。', category: 'Operations', isActive: false },
];

export const traditionalClips: TraditionalClip[] = [
  {
    id: 'tc1',
    hour: '14:00',
    timeLabel: '14:20',
    seqNo: '20',
    duration: "0'34\"",
    hasRedDot: true,
    hasHumanIcon: true,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-40262-large.mp4',
    baseSeconds: 14 * 3600 + 20 * 60 + 20, // 14:20:20
    description: 'B区后厨 - 主厨装配作业SOP异常核验段'
  },
  {
    id: 'tc2',
    hour: '14:00',
    timeLabel: '14:20',
    seqNo: '20',
    duration: "0'07\"",
    hasRedDot: false,
    hasHumanIcon: true,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-fresh-vegetable-salad-40243-large.mp4',
    baseSeconds: 14 * 3600 + 20 * 60 + 20, // 14:20:20
    description: 'B区后厨 - 备料区静默备餐与厨具整备'
  },
  {
    id: 'tc3',
    hour: '14:00',
    timeLabel: '14:19',
    seqNo: '',
    duration: "0'34\"",
    hasRedDot: true,
    hasHumanIcon: true,
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-working-with-wires-41619-large.mp4',
    baseSeconds: 14 * 3600 + 19 * 60 + 19, // 14:19:19
    description: 'A区配电房 - 安全带防坠落二次核对违规'
  },
  {
    id: 'tc4',
    hour: '14:00',
    timeLabel: '14:19',
    seqNo: '',
    duration: "0'17\"",
    hasRedDot: false,
    hasHumanIcon: true,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-board-circuit-of-electronic-equipment-42217-large.mp4',
    baseSeconds: 14 * 3600 + 19 * 60 + 19, // 14:19:19
    description: 'A区配电房 - 继电保护测试仪连线检测'
  },
  {
    id: 'tc5',
    hour: '14:00',
    timeLabel: '14:16',
    seqNo: '16',
    duration: "0'14\"",
    hasRedDot: false,
    hasHumanIcon: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-technician-working-on-a-motherboard-42218-large.mp4',
    baseSeconds: 14 * 3600 + 16 * 60 + 16, // 14:16:16
    description: 'A区配电房 - 初始接线与操作台清洁例检'
  },
  {
    id: 'tc6',
    hour: '13:00',
    timeLabel: '13:59',
    seqNo: '59',
    duration: "0'24\"",
    hasRedDot: false,
    hasHumanIcon: false,
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5eba2a29?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-industrial-lathe-machine-cutting-metal-42202-large.mp4',
    baseSeconds: 13 * 3600 + 59 * 60 + 59, // 13:59:59
    description: '机械精修间 - 车床待机安全气压指示查验'
  },
  {
    id: 'tc7',
    hour: '13:00',
    timeLabel: '13:56',
    seqNo: '56',
    duration: "0'38\"",
    hasRedDot: false,
    hasHumanIcon: false,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-computer-servers-in-a-server-room-41901-large.mp4',
    baseSeconds: 13 * 3600 + 56 * 60 + 56, // 13:56:56
    description: '中控网络柜 - 备用 UPS 蓄电池巡回电学参数测试'
  }
];

