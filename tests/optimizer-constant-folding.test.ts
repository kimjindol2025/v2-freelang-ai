/**
 * Phase 5 Step 1: Constant Folding Tests
 *
 * 20개 테스트로 모든 패턴 검증
 */

import { describe, it, expect } from '@jest/globals';
import { ConstantFolder } from '../src/optimizer/constant-folding';
import { Op } from '../src/types';

describe('ConstantFolder - Constant Folding Optimizer', () => {
  let folder: ConstantFolder;

  beforeEach(() => {
    folder = new ConstantFolder();
  });

  // ============================================================================
  // 1. 이항 연산 (Binary Operations) - 5개
  // ============================================================================
  describe('Binary Operations', () => {
    it('should fold PUSH 10, PUSH 20, ADD → PUSH 30', () => {
      const instructions = [
        { op: Op.PUSH, arg: 10 },
        { op: Op.PUSH, arg: 20 },
        { op: Op.ADD },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].op).toBe(Op.PUSH);
      expect(optimized[0].arg).toBe(30);
    });

    it('should fold PUSH 100, PUSH 30, SUB → PUSH 70', () => {
      const instructions = [
        { op: Op.PUSH, arg: 100 },
        { op: Op.PUSH, arg: 30 },
        { op: Op.SUB },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(70);
    });

    it('should fold PUSH 5, PUSH 6, MUL → PUSH 30', () => {
      const instructions = [
        { op: Op.PUSH, arg: 5 },
        { op: Op.PUSH, arg: 6 },
        { op: Op.MUL },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(30);
    });

    it('should fold PUSH 100, PUSH 4, DIV → PUSH 25', () => {
      const instructions = [
        { op: Op.PUSH, arg: 100 },
        { op: Op.PUSH, arg: 4 },
        { op: Op.DIV },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(25);
    });

    it('should fold PUSH 17, PUSH 5, MOD → PUSH 2', () => {
      const instructions = [
        { op: Op.PUSH, arg: 17 },
        { op: Op.PUSH, arg: 5 },
        { op: Op.MOD },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(2);
    });
  });

  // ============================================================================
  // 2. 단항 연산 (Unary Operations) - 2개
  // ============================================================================
  describe('Unary Operations', () => {
    it('should fold PUSH 42, NEG → PUSH -42', () => {
      const instructions = [{ op: Op.PUSH, arg: 42 }, { op: Op.NEG }];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(-42);
    });

    it('should fold PUSH 0, NOT → PUSH 1', () => {
      const instructions = [{ op: Op.PUSH, arg: 0 }, { op: Op.NOT }];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(1);
    });
  });

  // ============================================================================
  // 3. 비교 연산 (Comparison Operations) - 6개
  // ============================================================================
  describe('Comparison Operations', () => {
    it('should fold PUSH 10, PUSH 10, EQ → PUSH 1 (true)', () => {
      const instructions = [
        { op: Op.PUSH, arg: 10 },
        { op: Op.PUSH, arg: 10 },
        { op: Op.EQ },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(1);
    });

    it('should fold PUSH 10, PUSH 20, EQ → PUSH 0 (false)', () => {
      const instructions = [
        { op: Op.PUSH, arg: 10 },
        { op: Op.PUSH, arg: 20 },
        { op: Op.EQ },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(0);
    });

    it('should fold PUSH 5, PUSH 10, LT → PUSH 1 (true)', () => {
      const instructions = [
        { op: Op.PUSH, arg: 5 },
        { op: Op.PUSH, arg: 10 },
        { op: Op.LT },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(1);
    });

    it('should fold PUSH 10, PUSH 5, GT → PUSH 1 (true)', () => {
      const instructions = [
        { op: Op.PUSH, arg: 10 },
        { op: Op.PUSH, arg: 5 },
        { op: Op.GT },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(1);
    });

    it('should fold PUSH 10, PUSH 10, LTE → PUSH 1 (true)', () => {
      const instructions = [
        { op: Op.PUSH, arg: 10 },
        { op: Op.PUSH, arg: 10 },
        { op: Op.LTE },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(1);
    });

    it('should fold PUSH 5, PUSH 10, GTE → PUSH 0 (false)', () => {
      const instructions = [
        { op: Op.PUSH, arg: 5 },
        { op: Op.PUSH, arg: 10 },
        { op: Op.GTE },
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(0);
    });
  });

  // ============================================================================
  // 4. 복합 패턴 (Composite Patterns) - 3개
  // ============================================================================
  describe('Composite Patterns', () => {
    it('should fold chained operations: PUSH 2, PUSH 3, ADD, PUSH 5, MUL → PUSH 25', () => {
      const instructions = [
        { op: Op.PUSH, arg: 2 },
        { op: Op.PUSH, arg: 3 },
        { op: Op.ADD }, // 2 + 3 = 5
        { op: Op.PUSH, arg: 5 },
        { op: Op.MUL }, // 5 * 5 = 25
      ];

      const optimized = folder.fold(instructions);

      expect(optimized.length).toBe(1);
      expect(optimized[0].arg).toBe(25);
    });

    it('should fold mixed with non-foldable: PUSH 10, PUSH 20, ADD, LOAD x, ADD', () => {
      const instructions = [
        { op: Op.PUSH, arg: 10 },
        { op: Op.PUSH, arg: 20 },
        { op: Op.ADD }, // 10 + 20 = 30
        { op: Op.LOAD, arg: 'x' }, // 상수 아님
        { op: Op.ADD }, // LOAD와 함께 폴딩 불가
      ];

      const optimized = folder.fold(instructions);

      // 첫 ADD 폴딩됨
      expect(optimized[0].op).toBe(Op.PUSH);
      expect(optimized[0].arg).toBe(30);
      // LOAD와 ADD는 유지됨
      expect(optimized[1].op).toBe(Op.LOAD);
      expect(optimized[2].op).toBe(Op.ADD);
    });

    it('should handle nested sub-programs with folding', () => {
      const instructions = [
        {
          op: Op.ARR_MAP,
          sub: [
            { op: Op.PUSH, arg: 2 },
            { op: Op.PUSH, arg: 3 },
            { op: Op.ADD },
            { op: Op.RET },
          ],
        },
      ];

      const optimized = folder.fold(instructions);

      // 서브프로그램도 최적화됨
      expect(optimized[0].op).toBe(Op.ARR_MAP);
      expect(optimized[0].sub?.length).toBe(2); // PUSH 5, RET
    });
  });

  // ============================================================================
  // 5. 엣지 케이스 (Edge Cases) - 4개
  // ============================================================================
  describe('Edge Cases', () => {
    it('should not fold division by zero', () => {
      const instructions = [
        { op: Op.PUSH, arg: 100 },
        { op: Op.PUSH, arg: 0 },
        { op: Op.DIV },
      ];

      const optimized = folder.fold(instructions);

      // 폴딩되지 않음 (안전성)
      expect(optimized.length).toBe(3);
    });

    it('should not fold modulo by zero', () => {
      const instructions = [
        { op: Op.PUSH, arg: 17 },
        { op: Op.PUSH, arg: 0 },
        { op: Op.MOD },
      ];

      const optimized = folder.fold(instructions);

      // 폴딩되지 않음 (안전성)
      expect(optimized.length).toBe(3);
    });

    it('should not fold if first operand is not PUSH', () => {
      const instructions = [
        { op: Op.LOAD, arg: 'x' },
        { op: Op.PUSH, arg: 20 },
        { op: Op.ADD },
      ];

      const optimized = folder.fold(instructions);

      // 폴딩되지 않음
      expect(optimized.length).toBe(3);
    });

    it('should not fold if argument is not numeric', () => {
      const instructions = [
        { op: Op.PUSH, arg: 'hello' },
        { op: Op.PUSH, arg: 20 },
        { op: Op.ADD },
      ];

      const optimized = folder.fold(instructions);

      // 폴딩되지 않음
      expect(optimized.length).toBe(3);
    });
  });

  // ============================================================================
  // 6. 성능 & 통계 - 0개 (아래 별도)
  // ============================================================================
  describe('Statistics', () => {
    it('should provide accurate optimization statistics', () => {
      const original = [
        { op: Op.PUSH, arg: 10 },
        { op: Op.PUSH, arg: 20 },
        { op: Op.ADD },
        { op: Op.PUSH, arg: 5 },
        { op: Op.MUL },
      ];

      const optimized = folder.fold(original);
      const stats = folder.getStats(original, optimized);

      expect(stats.originalSize).toBe(5);
      expect(stats.optimizedSize).toBe(1);
      expect(stats.saved).toBe(4);
      expect(stats.savedPercent).toBe(80);
    });
  });
});
