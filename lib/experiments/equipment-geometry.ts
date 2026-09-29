/**
 * MageLabs Canonical Physical Equipment Geometry
 * 
 * Single source of truth for:
 * 1. Physical 3D bounding dimensions
 * 2. Exact local relative terminal coordinates
 * 3. Terminal polarities and connector orientation vectors
 * 4. Interaction hitboxes
 * 
 * Both 3D mesh components and wire routing algorithms consume these exact coordinates.
 */

export interface CanonicalTerminalDef {
  idSuffix: string;
  name: string;
  label: string;
  polarity: 'positive' | 'negative' | 'neutral';
  localOffset: [number, number, number]; // [x, y, z] relative to component center
  normal: [number, number, number];      // direction vector plug faces
  plugType: 'banana_4mm' | 'binding_post' | 'probe_socket';
}

export interface CanonicalEquipmentSpec {
  type: string;
  dimensions: [number, number, number]; // [width, height, depth]
  terminals: CanonicalTerminalDef[];
}

export const CANONICAL_EQUIPMENT_GEOMETRY: Record<string, CanonicalEquipmentSpec> = {
  'power-supply': {
    type: 'power-supply',
    dimensions: [1.3, 0.9, 0.95],
    terminals: [
      {
        idSuffix: 'pos',
        name: 'Positive Output (+)',
        label: '+',
        polarity: 'positive',
        localOffset: [0.32, 0.12, 0.52],
        normal: [0, 0, 1],
        plugType: 'banana_4mm'
      },
      {
        idSuffix: 'neg',
        name: 'Negative Ground (-)',
        label: '-',
        polarity: 'negative',
        localOffset: [-0.32, 0.12, 0.52],
        normal: [0, 0, 1],
        plugType: 'banana_4mm'
      },
      {
        idSuffix: 'gnd',
        name: 'Chassis Earth Ground',
        label: 'GND',
        polarity: 'neutral',
        localOffset: [0.0, 0.12, 0.52],
        normal: [0, 0, 1],
        plugType: 'banana_4mm'
      }
    ]
  },

  'switch': {
    type: 'switch',
    dimensions: [1.2, 0.08, 0.6],
    terminals: [
      {
        idSuffix: 't1',
        name: 'Hinge Terminal',
        label: 'IN',
        polarity: 'neutral',
        localOffset: [-0.35, 0.08, 0.2],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      },
      {
        idSuffix: 't2',
        name: 'Jaw Contact Terminal',
        label: 'OUT',
        polarity: 'neutral',
        localOffset: [0.35, 0.08, 0.2],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      }
    ]
  },

  'resistor': {
    type: 'resistor',
    dimensions: [1.3, 0.08, 0.65],
    terminals: [
      {
        idSuffix: 't1',
        name: 'Left Terminal A',
        label: 'A',
        polarity: 'neutral',
        localOffset: [-0.45, 0.08, 0.0],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      },
      {
        idSuffix: 't2',
        name: 'Right Terminal B',
        label: 'B',
        polarity: 'neutral',
        localOffset: [0.45, 0.08, 0.0],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      }
    ]
  },

  'light-bulb': {
    type: 'light-bulb',
    dimensions: [0.8, 0.8, 0.8],
    terminals: [
      {
        idSuffix: 't1',
        name: 'Base Thread Terminal 1',
        label: 'T1',
        polarity: 'neutral',
        localOffset: [-0.26, 0.1, 0.0],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      },
      {
        idSuffix: 't2',
        name: 'Base Contact Terminal 2',
        label: 'T2',
        polarity: 'neutral',
        localOffset: [0.26, 0.1, 0.0],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      }
    ]
  },

  'ammeter': {
    type: 'ammeter',
    dimensions: [1.05, 0.55, 0.85],
    terminals: [
      {
        idSuffix: 'in',
        name: 'Current In (+A)',
        label: '+A',
        polarity: 'positive',
        localOffset: [-0.25, 0.12, 0.38],
        normal: [0, 0, 1],
        plugType: 'banana_4mm'
      },
      {
        idSuffix: 'out',
        name: 'Current Out (-COM)',
        label: '-COM',
        polarity: 'negative',
        localOffset: [0.25, 0.12, 0.38],
        normal: [0, 0, 1],
        plugType: 'banana_4mm'
      }
    ]
  },

  'voltmeter': {
    type: 'voltmeter',
    dimensions: [1.0, 0.52, 0.8],
    terminals: [
      {
        idSuffix: 'pos',
        name: 'Voltage Probe (+ VΩ)',
        label: 'VΩ',
        polarity: 'positive',
        localOffset: [0.22, 0.08, 0.36],
        normal: [0, 0, 1],
        plugType: 'probe_socket'
      },
      {
        idSuffix: 'neg',
        name: 'Common Probe (- COM)',
        label: 'COM',
        polarity: 'negative',
        localOffset: [-0.22, 0.08, 0.36],
        normal: [0, 0, 1],
        plugType: 'probe_socket'
      }
    ]
  },

  'capacitor': {
    type: 'capacitor',
    dimensions: [0.8, 0.6, 0.6],
    terminals: [
      {
        idSuffix: 'pos',
        name: 'Positive Plate (+)',
        label: '+',
        polarity: 'positive',
        localOffset: [-0.22, 0.08, 0.0],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      },
      {
        idSuffix: 'neg',
        name: 'Negative Plate (-)',
        label: '-',
        polarity: 'negative',
        localOffset: [0.22, 0.08, 0.0],
        normal: [0, 1, 0],
        plugType: 'binding_post'
      }
    ]
  }
};

/**
 * Returns canonical terminals for any equipment type with their full component-prefixed IDs
 */
export function getCanonicalTerminals(componentId: string, componentType: string) {
  const spec = CANONICAL_EQUIPMENT_GEOMETRY[componentType];
  if (!spec) return [];

  return spec.terminals.map(t => ({
    id: `${componentId}-${t.idSuffix}`,
    componentId,
    name: t.name,
    label: t.label,
    polarity: t.polarity,
    position: [...t.localOffset] as [number, number, number],
    normal: [...t.normal] as [number, number, number],
    plugType: t.plugType
  }));
}
