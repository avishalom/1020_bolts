import {
  Project,
  Task,
  TaskCategory,
  ProjectRequirement,
  OwnedItem,
  Question,
  Answer,
  PlanningBucket,
  UserProfile,
  Club,
  DiscussionComment
} from '@/types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_1',
    username: 'avishalom',
    full_name: 'Vish (You)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Sailing enthusiast, embedded electronics tinkerer, and DIY woodworker.',
    location: 'Seattle, WA'
  },
  {
    id: 'user_2',
    username: 'sam_tech',
    full_name: 'Sam Miller',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'RF Engineer & Marine Systems Specialist.',
    location: 'Anacortes, WA'
  },
  {
    id: 'user_3',
    username: 'elena_wood',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Master Upholsterer & Sailmaker.',
    location: 'Port Townsend, WA'
  },
  {
    id: 'user_4',
    username: 'captain_dan',
    full_name: 'Dan O\'Connor',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Liveaboard cruiser and diesel mechanic.',
    location: 'Bellingham, WA'
  }
];

export const MOCK_BUCKETS: PlanningBucket[] = [
  { id: 'b_1', user_id: 'user_1', name: 'Urgent', color: '#ef4444' },
  { id: 'b_2', user_id: 'user_1', name: 'At the Shop', color: '#f59e0b' },
  { id: 'b_3', user_id: 'user_1', name: 'On the Hard', color: '#8b5cf6' },
  { id: 'b_4', user_id: 'user_1', name: 'Sunny Day', color: '#10b981' },
  { id: 'b_5', user_id: 'user_1', name: 'Winter Project', color: '#3b82f6' },
  { id: 'b_6', user_id: 'user_1', name: 'Later', color: '#6b7280' }
];

export const MOCK_CLUBS: Club[] = [
  {
    id: 'club_1',
    owner_id: 'user_2',
    name: 'Puget Sound Marine Craftsmen',
    description: 'A club for boat refitters, marine electricians, and DIY sailors.',
    is_private: false,
    location: 'Puget Sound, WA',
    members_count: 24
  },
  {
    id: 'club_2',
    owner_id: 'user_1',
    name: 'Open Hardware & LoRa Guild',
    description: 'Makers building telemetry, IoT sensors, and custom electronics.',
    is_private: false,
    location: 'Pacific Northwest',
    members_count: 18
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_parent',
    owner_id: 'user_1',
    parent_id: null,
    title: '2026 Vessel Refit & Upgrades',
    description: 'Overarching overhaul program for marine electronics, sanitation, and interior comfort.',
    status: 'active',
    visibility: 'trusted_people',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-09-20T14:30:00Z',
    buckets: [MOCK_BUCKETS[2], MOCK_BUCKETS[4]],
    child_count: 3,
    tasks_count: 14,
    tasks_done_count: 6,
    requirements_count: 11,
    requirements_needed_count: 4,
    questions_count: 3
  },
  {
    id: 'proj_1',
    owner_id: 'user_1',
    parent_id: 'proj_parent',
    parent_title: '2026 Vessel Refit & Upgrades',
    title: 'Head Plumbing Overhaul & Sanitation Hoses',
    description: 'Replace marine toilet vented loop, anti-odor sanitation hoses, and rebuild joker valve assembly.',
    status: 'active',
    visibility: 'trusted_people',
    created_at: '2026-09-01T09:00:00Z',
    updated_at: '2026-09-21T18:00:00Z',
    buckets: [MOCK_BUCKETS[0], MOCK_BUCKETS[1]],
    tasks_count: 5,
    tasks_done_count: 2,
    requirements_count: 4,
    requirements_needed_count: 2,
    questions_count: 1
  },
  {
    id: 'proj_2',
    owner_id: 'user_1',
    parent_id: 'proj_parent',
    parent_title: '2026 Vessel Refit & Upgrades',
    title: 'Electronic Tension Meter with LoRa Telemetry',
    description: 'Custom rig tension sensor using strain gauges, HX711 amplifier, ESP32-S3, and airborne LoRa telemetry transmitter.',
    status: 'active',
    visibility: 'trusted_people',
    created_at: '2026-09-05T12:00:00Z',
    updated_at: '2026-09-21T19:00:00Z',
    buckets: [MOCK_BUCKETS[1], MOCK_BUCKETS[4]],
    tasks_count: 6,
    tasks_done_count: 3,
    requirements_count: 5,
    requirements_needed_count: 1,
    questions_count: 1
  },
  {
    id: 'proj_3',
    owner_id: 'user_1',
    parent_id: 'proj_parent',
    parent_title: '2026 Vessel Refit & Upgrades',
    title: 'Custom Curved V-Berth Mattress & Upholstery',
    description: 'Templating and cutting high-density dual-layer memory foam for irregular boat bow berth contour.',
    status: 'active',
    visibility: 'selected_clubs',
    created_at: '2026-09-10T15:00:00Z',
    updated_at: '2026-09-19T11:00:00Z',
    buckets: [MOCK_BUCKETS[3], MOCK_BUCKETS[5]],
    tasks_count: 3,
    tasks_done_count: 1,
    requirements_count: 2,
    requirements_needed_count: 1,
    questions_count: 1
  }
];

export const MOCK_TASK_CATEGORIES: TaskCategory[] = [
  { id: 'cat_1', project_id: 'proj_1', name: 'Disassembly & Prep', position: 1 },
  { id: 'cat_2', project_id: 'proj_1', name: 'Plumbing Installation', position: 2 },
  { id: 'cat_3', project_id: 'proj_2', name: 'Hardware & Sensor Rigging', position: 1 },
  { id: 'cat_4', project_id: 'proj_2', name: 'Firmware & Wireless Telemetry', position: 2 }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't_1',
    project_id: 'proj_1',
    category_id: 'cat_1',
    title: 'Disconnect old 1-1/2" sanitation hose and drain loop',
    notes: 'Wear nitrile gloves and use heat gun to soften stubborn hose ends.',
    status: 'done',
    position: 1,
    created_at: '2026-09-02T10:00:00Z'
  },
  {
    id: 't_2',
    project_id: 'proj_1',
    category_id: 'cat_1',
    title: 'Inspect thru-hull bronze seacock for corrosion',
    notes: 'Check ball valve movement and greasing port.',
    status: 'done',
    position: 2,
    created_at: '2026-09-02T11:00:00Z'
  },
  {
    id: 't_3',
    project_id: 'proj_1',
    category_id: 'cat_2',
    title: 'Route Trident 101 smell-proof sanitation hose',
    notes: 'Avoid sharp bends; maintain positive slope to holding tank.',
    status: 'in_progress',
    referenced_person_id: 'user_4',
    referenced_person_name: 'Dan O\'Connor',
    position: 3,
    created_at: '2026-09-03T14:00:00Z'
  },
  {
    id: 't_4',
    project_id: 'proj_1',
    category_id: 'cat_2',
    title: 'Double hose clamp all connections below waterline',
    notes: 'Use 316 stainless steel T-bolt clamps.',
    status: 'backlog',
    position: 4,
    created_at: '2026-09-03T15:00:00Z'
  },
  {
    id: 't_5',
    project_id: 'proj_2',
    category_id: 'cat_3',
    title: 'Calibrate load cell strain gauge array on rig tension bench',
    notes: 'Test calibration against known 500lb tension calibration weight.',
    status: 'done',
    referenced_person_id: 'user_2',
    referenced_person_name: 'Sam Miller',
    position: 1,
    created_at: '2026-09-06T09:00:00Z'
  },
  {
    id: 't_6',
    project_id: 'proj_2',
    category_id: 'cat_4',
    title: 'Program SX1262 LoRa transmitter packet loop in Arduino C++',
    notes: 'Target 915 MHz frequency with low-power sleep state between telemetry bursts.',
    status: 'in_progress',
    position: 2,
    created_at: '2026-09-07T13:00:00Z'
  }
];

export const MOCK_OWNED_ITEMS: OwnedItem[] = [
  {
    id: 'item_1',
    owner_id: 'user_2',
    owner_name: 'Sam Miller',
    name: 'SX1262 LoRa 915MHz Transceiver Module',
    category: 'Electronics',
    search_aliases: ['lora', '915mhz', 'telemetry', 'radio', 'sx1262'],
    specifications: '30dBm output power, SPI interface, IPEX antenna connector',
    sharing_disposition: 'surplus_available',
    available_quantity: '2 units surplus',
    visibility: 'trusted_people',
    created_at: '2026-08-20T10:00:00Z'
  },
  {
    id: 'item_2',
    owner_id: 'user_3',
    owner_name: 'Elena Rostova',
    name: 'Electric Foam Cutter Knife & Vinyl Shears',
    category: 'Tools',
    search_aliases: ['foam cutter', 'upholstery tool', 'hot knife', 'shears'],
    specifications: 'Dual high-speed reciprocating blades for clean memory foam cuts',
    sharing_disposition: 'available_to_lend',
    available_quantity: '1 tool',
    visibility: 'trusted_people',
    created_at: '2026-08-25T14:00:00Z'
  },
  {
    id: 'item_3',
    owner_id: 'user_1',
    owner_name: 'Vish (You)',
    name: '316 Stainless Steel T-Bolt Hose Clamps 1.5"',
    category: 'Hardware & Fasteners',
    search_aliases: ['hose clamp', 't-bolt', '316 stainless', '1.5 inch'],
    specifications: 'Heavy duty marine grade 316 SS',
    sharing_disposition: 'surplus_available',
    available_quantity: '6 clamps remaining',
    visibility: 'trusted_people',
    created_at: '2026-09-02T16:00:00Z'
  },
  {
    id: 'item_4',
    owner_id: 'user_4',
    owner_name: 'Dan O\'Connor',
    name: 'Trident 101 Odor-Shield Sanitation Hose 1-1/2"',
    category: 'Plumbing',
    search_aliases: ['sanitation hose', 'trident 101', 'head hose', 'boat hose'],
    specifications: 'Smooth bore butyl rubber odor barrier hose',
    sharing_disposition: 'surplus_available',
    available_quantity: '12 feet surplus length',
    visibility: 'trusted_people',
    created_at: '2026-09-03T11:00:00Z'
  }
];

export const MOCK_REQUIREMENTS: ProjectRequirement[] = [
  {
    id: 'req_1',
    project_id: 'proj_1',
    name: 'Trident 101 Odor-Shield Sanitation Hose 1-1/2"',
    category: 'Plumbing',
    quantity: '10',
    unit: 'feet',
    specifications: 'Heavy wall butyl rubber odor-impermeable marine hose',
    notes: 'Must withstand vacuum discharge without collapsing.',
    fulfillment_status: 'fulfilled',
    sourcing_preference: 'borrow',
    fulfilled_by_owned_item_id: 'item_4',
    fulfilled_item: MOCK_OWNED_ITEMS[3],
    visibility: 'inherited',
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'req_2',
    project_id: 'proj_1',
    name: '316 Stainless Steel T-Bolt Hose Clamps 1-1/2"',
    category: 'Hardware',
    quantity: '4',
    unit: 'pieces',
    specifications: '316 SS band and T-bolt bolt mechanism',
    notes: 'Do not use standard 304 worm gear clamps below waterline.',
    fulfillment_status: 'needed',
    sourcing_preference: 'any',
    visibility: 'inherited',
    created_at: '2026-09-01T11:00:00Z'
  },
  {
    id: 'req_3',
    project_id: 'proj_2',
    name: 'SX1262 LoRa Transceiver Module (915 MHz)',
    category: 'Electronics',
    quantity: '1',
    unit: 'module',
    specifications: '915MHz SPI interface module',
    notes: 'Need antenna pigtail U.FL to SMA.',
    fulfillment_status: 'fulfilled',
    sourcing_preference: 'buy',
    fulfilled_by_owned_item_id: 'item_1',
    fulfilled_item: MOCK_OWNED_ITEMS[0],
    visibility: 'inherited',
    created_at: '2026-09-05T13:00:00Z'
  },
  {
    id: 'req_4',
    project_id: 'proj_2',
    name: 'S-Type Load Cell 500kg Tension Sensor',
    category: 'Sensors',
    quantity: '1',
    unit: 'sensor',
    specifications: 'High accuracy alloy steel strain gauge',
    notes: 'Needs M12 threaded rod ends for wire rigging insert.',
    fulfillment_status: 'needed',
    sourcing_preference: 'buy',
    visibility: 'inherited',
    created_at: '2026-09-05T14:00:00Z'
  },
  {
    id: 'req_5',
    project_id: 'proj_3',
    name: 'High Density Memory Foam Sheet (4" thickness)',
    category: 'Upholstery',
    quantity: '1',
    unit: 'full sheet (80x60")',
    specifications: 'Medium-firm open-cell breathable marine foam',
    notes: 'Will cut with electric knife to berth shape.',
    fulfillment_status: 'needed',
    sourcing_preference: 'buy',
    visibility: 'inherited',
    created_at: '2026-09-10T16:00:00Z'
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q_1',
    project_id: 'proj_1',
    project_title: 'Head Plumbing Overhaul & Sanitation Hoses',
    author_id: 'user_1',
    author_name: 'Vish (You)',
    title: 'Best technique to lubricate 1-1/2" thick sanitation hose onto barbed fittings?',
    details: 'The Trident 101 hose is extremely stiff. Should I heat it in boiling water or use dish soap / silicone lube without degrading the rubber barrier?',
    status: 'answered',
    visibility: 'inherited',
    created_at: '2026-09-03T16:00:00Z',
    answers_count: 2,
    answers: [
      {
        id: 'ans_1',
        question_id: 'q_1',
        author_id: 'user_4',
        author_name: 'Dan O\'Connor',
        content: 'Use a heat gun or dip the hose tip in hot water for 60 seconds! Avoid dish soap or petroleum lube as it stays slick inside and can cause blowout under pump pressure. Water-based KY or clear glycerine works great if lube is needed.',
        is_accepted: true,
        created_at: '2026-09-03T18:15:00Z'
      },
      {
        id: 'ans_2',
        question_id: 'q_1',
        author_id: 'user_2',
        author_name: 'Sam Miller',
        content: '+1 on hot water bath. Also make sure to chamfer the outer edge of the plastic barb slightly with a fine file so it doesn\'t scrape inner lining.',
        is_accepted: false,
        created_at: '2026-09-03T19:00:00Z'
      }
    ]
  },
  {
    id: 'q_2',
    project_id: 'proj_2',
    project_title: 'Electronic Tension Meter with LoRa Telemetry',
    author_id: 'user_1',
    author_name: 'Vish (You)',
    title: 'LoRa 915 MHz antenna placement on carbon fiber vs aluminum mast?',
    details: 'Will mounting the whip antenna directly on the mast step degrade radiation pattern significantly due to RF reflection?',
    status: 'open',
    visibility: 'inherited',
    created_at: '2026-09-08T10:00:00Z',
    answers_count: 1,
    answers: [
      {
        id: 'ans_3',
        question_id: 'q_2',
        author_id: 'user_2',
        author_name: 'Sam Miller',
        content: 'Carbon fiber acts as a partial RF conductor and reflector at 915MHz! You\'ll want at least 1/4 wavelength (~8cm) standoff bracket away from carbon stay, or use a dipole with built-in ground plane.',
        is_accepted: false,
        created_at: '2026-09-08T11:30:00Z'
      }
    ]
  }
];

export const MOCK_DISCUSSIONS: DiscussionComment[] = [
  {
    id: 'disc_1',
    entity_type: 'owned_item',
    entity_id: 'item_4',
    author_id: 'user_1',
    author_name: 'Vish (You)',
    content: 'Hey Dan, is that 12ft surplus length of Trident 101 hose still available? I need about 10ft for my head overhaul!',
    created_at: '2026-09-03T12:00:00Z'
  },
  {
    id: 'disc_2',
    entity_type: 'owned_item',
    entity_id: 'item_4',
    author_id: 'user_4',
    author_name: 'Dan O\'Connor',
    content: 'Yes! It\'s sitting right on my shop workbench in Anacortes. Stop by anytime this weekend to grab what you need.',
    created_at: '2026-09-03T12:45:00Z'
  }
];
