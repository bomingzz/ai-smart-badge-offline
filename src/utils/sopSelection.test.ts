import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AVAILABLE_SOP_TEMPLATES,
  getDefaultSopTemplateForClip,
  resolveCurrentExecutingSopId,
  resolveSopTemplateById,
  applySingleSopSelection
} from './sopSelection';

test('AVAILABLE_SOP_TEMPLATES contains all 4 existing SOP templates', () => {
  assert.equal(AVAILABLE_SOP_TEMPLATES.length, 4);
  assert.deepEqual(AVAILABLE_SOP_TEMPLATES.map(t => t.id), ['ck', 'ee', 'sf', 'mf']);
});

test('getDefaultSopTemplateForClip matches clip and device keywords accurately', () => {
  assert.equal(
    getDefaultSopTemplateForClip({ description: 'B区后厨 - 主厨装配作业SOP异常核验段' }).id,
    'ck'
  );
  assert.equal(
    getDefaultSopTemplateForClip({ description: 'A区配电房 - 安全带防坠落二次核对违规' }).id,
    'ee'
  );
  assert.equal(
    getDefaultSopTemplateForClip({ description: '东门 - 夜间周界消防通道巡检' }).id,
    'sf'
  );
  assert.equal(
    getDefaultSopTemplateForClip({ description: 'C区车间 - 精密车床装配工序' }).id,
    'mf'
  );
});

test('resolveCurrentExecutingSopId prioritizes user single-selected SOP over historical and default SOP', () => {
  const clip = { id: 'tc1', description: 'B区后厨 - 主厨装配作业SOP异常核验段' };
  const records = {
    tc1: [
      {
        sopTaskId: 'ck' as const,
        sopShortName: '餐饮后厨SOP',
        sopFullName: '餐饮后厨冷链生鲜与切配卫生 SOP',
        icon: '🍳',
        timelineEventId: 't2',
        analyzedAt: '2026-07-07 14:20:20'
      }
    ]
  };

  // Without explicit user override, uses record's SOP
  assert.equal(resolveCurrentExecutingSopId(clip, {}, records), 'ck');

  // After single-selecting 'ee' in the unified modal, resolves to 'ee'
  const updatedMap = applySingleSopSelection({}, 'tc1', 'ee');
  assert.equal(resolveCurrentExecutingSopId(clip, updatedMap, records), 'ee');
  assert.equal(resolveSopTemplateById('ee').shortName, '高压电工SOP');
});
