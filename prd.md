# Product Requirements Document

## 1. Product Summary

**Working name:** ProjectHub / CraftShare

**Product statement:** A project-management tool for people undertaking physical projects. Users organize tasks, project requirements, tools, and questions, then selectively expose needs, available items, questions, and completed projects to trusted people and clubs.

The project is the center of the product. A person's inventory and shareable catalog emerge naturally as they plan and complete real projects; maintaining a separate inventory is not required before the product becomes useful.

### 1.1 Initial target user

The initial user is an individual maker managing projects for themselves. Example projects include:

- Repairing plumbing to the head on a boat.
- Building an electronic tension meter with airborne telemetry over Wi-Fi or LoRa.
- Ordering or making custom-sized mattresses for a boat.

The product should support a broad range of physical projects without imposing a trade-specific workflow.

### 1.2 Core principles

1. **Single-user first:** Project and task management must be useful without an existing community.
2. **Collaboration when needed:** The network becomes valuable when a user needs materials, tools, availability information, or advice, or has surplus to share.
3. **Projects create the catalog:** Requirements added to projects can later become owned or shareable items. Users are not asked to inventory their workshop upfront.
4. **Informal trust:** Sharing is a friendly arrangement between trusted people, not a rental marketplace or library-management system.
5. **Contextual communication:** Questions, answers, and discussions attach to concrete entities rather than a global chat stream.
6. **Private by default:** Projects and items are private unless the user deliberately shares them.

## 2. Goals and Success Criteria

### 2.1 MVP goals

- Help a user plan and complete a physical project.
- Make tasks, required materials, non-standard tools, and unanswered questions visible in one place.
- Let users discover needed or available items within permitted social scopes.
- Let users ask for and receive advice in context.
- Build a searchable personal and shared catalog as a by-product of project work.
- Preserve completed projects as a searchable, reusable library.

### 2.2 Evidence that the MVP is useful

The MVP is working when users:

- Create projects.
- Add tasks and move them to Done.
- Add project requirements and mark them Fulfilled.
- Ask questions and receive answers or close the questions.
- Find available items or visible needs through search or browsing.
- Return to completed projects or duplicate them for reuse.

Exact activation, retention, and conversion targets remain to be established after initial testing.

## 3. Core Concepts and Information Model

### 3.1 Project

A project is the primary container for work. It contains tasks, requirements, questions, people references, contextual discussions, and supporting information.

A project has:

- Name and description.
- Status: **Draft**, **Active**, **Paused**, or **Completed**.
- Visibility settings.
- Zero or one parent project.
- Zero or more child projects.
- Zero or more user-defined planning buckets.
- Tasks, requirements, questions, people references, links, attachments, and discussions.

Completed projects remain in the searchable project library; there is no separate Archived state in the MVP.

### 3.2 Project hierarchy

Projects may belong to a hierarchy. This supports large bodies of work broken into independently manageable projects, such as survey-report items grouped under a refit or maintenance program.

MVP requirements:

- A project may have one parent and multiple children.
- The UI must show the project's parent and immediate children.
- Search must be able to find projects regardless of their level in the hierarchy.
- Completing a parent does not automatically complete its children, and completing all children does not automatically complete the parent.
- Moving or deleting a project must not silently delete its descendants.

### 3.3 Planning buckets

Users may classify projects using user-defined planning buckets such as **Urgent**, **Later**, **Winter**, **Sunny Day**, **At the Shop**, or **On the Hard**.

Although initially described as timeline categories, these labels may represent urgency, season, weather, location, or operating context. The product should therefore model them as flexible planning buckets rather than fixed chronological states.

MVP requirements:

- Users can create, rename, apply, and remove planning buckets.
- A project may have multiple buckets because contexts may overlap (for example, **Urgent** and **At the Shop**).
- Users can browse and filter projects by bucket.
- Buckets do not replace project status or due dates.

### 3.4 Task

A task is a sub-item of a project and cannot exist independently in the MVP.

A task has:

- Title and optional notes.
- Status: **Backlog**, **In Progress**, **Blocked**, or **Done**.
- A task category or subsection within the project.
- Optional links to people referenced on the project.
- Optional links to project requirements.
- Optional links to project questions.

Linking a person to a task is initially a reference, such as “ask Sam,” and does not assign editing rights or responsibility. Collaborative task assignment is outside the MVP.

### 3.5 Project requirement

“Project requirement” is used instead of “bill of materials” because the list includes both consumed materials/components and reusable, non-standard tools. Common tools do not need to be listed unless useful to the user.

A requirement has:

- A user-entered item name.
- A broad item type or category.
- Optional free-text quantity, unit, specifications, and notes.
- Fulfillment status: **Needed**, **Fulfilled**, or **No Longer Needed**.
- Optional sourcing preference: **Already Owned**, **Buy**, **Borrow**, **Make**, **Any**, or **Undecided**.
- Optional link to the owned item that fulfills it.
- Visibility settings inherited from the project unless narrowed by the user.

Requirements belong to the project. Tasks may link to one or more requirements.

“Fulfilled” means the required item exists and is available for the project. The MVP does not need to calculate allocations or reserve quantities between projects. Multiple projects may refer to the same tool or consumable, and people resolve capacity conflicts conversationally.

### 3.6 Owned and available item

An item owned by a user exists independently of any project. A fulfilled requirement may link to an owned item, but fulfilling a requirement must not automatically publish or add an item to the user's shareable catalog.

After fulfillment, the UI may offer an explicit action to create or link an owned item and choose its sharing disposition:

- **Private:** Recorded for the owner only.
- **Available to Lend:** A reusable tool or item may be borrowed informally.
- **Surplus Available:** Some or all of a material or consumable may be transferred or consumed by someone else.
- **Unavailable:** The item is known but not currently offered.

An available item may have a free-text available quantity. Inventory accounting, reservations, automatic decrementing, and guarantees of availability are outside the MVP.

### 3.7 Question and answer

Questions belong to a project and may optionally link to tasks or requirements.

A question has:

- Title and optional detail.
- Status: **Open**, **Answered**, or **Closed**.
- Visibility settings.
- Zero or more in-app answers.
- A contextual discussion thread.

Authorized viewers may answer in the app. This is contextual participation, not collaborative project editing. The product must notify the question owner of new answers and permit authors to edit or remove their own contributions.

### 3.8 Item taxonomy

Items need to be searchable and browsable even when users describe them differently. The MVP taxonomy consists of:

- A user-suggested item name.
- A broad category.
- Optional search aliases.
- Free-text specifications.

Users may suggest new item names. They must not be forced to locate a perfect canonical taxonomy entry before saving an item. Administrative consolidation, merging, and richer structured specifications are backlog work.

Examples such as “14-gauge wire” and “1/4-20 set screw” should be discoverable by their entered names and aliases. The MVP does not need a universal attribute schema for wire gauges, thread standards, dimensions, materials, or similar domain-specific specifications.

## 4. Personal Project Management

### 4.1 Core workflow

1. The user creates a project, optionally under a parent project.
2. The user assigns any useful planning buckets.
3. The user creates task categories and tasks.
4. The user records required materials, components, and non-standard tools.
5. The user links tasks, requirements, questions, and people where useful.
6. The user progresses tasks and resolves requirements and questions.
7. The user marks the project Completed.
8. The completed project remains searchable and may be duplicated as the starting point for another project.

### 4.2 Reusing a completed project

Duplicating a completed project should copy reusable structure and knowledge, including tasks, task categories, requirements, descriptions, instructions, and useful links.

The new project must receive fresh workflow state and privacy choices. It must not copy prior fulfillment states, answers, discussions, or person links by default.

## 5. People, Clubs, and Trust

### 5.1 Trusted access between people

Access between people is one-sided:

- A user may grant another person access to content shared with their trusted people.
- The recipient does not need to reciprocate.
- The app may suggest reciprocity, creating an effectively two-sided relationship when both users independently grant access.

The interface may use approachable language such as “friends,” but the permission model must not assume mutual access.

### 5.2 Clubs

A club is an owner-managed group. It may be private or open and may or may not have a location.

MVP club characteristics:

- A club has an owner who manages membership and basic club settings.
- Content may be shared specifically with one or more clubs.
- Club membership grants access only to content shared with that club; it does not automatically create person-to-person trust relationships.
- The product may offer an explicit option to connect with club members rather than silently making every member a friend.
- Leaving or being removed from a club removes club-derived access.

Detailed club governance, multiple administrator roles, moderation workflows, and ownership transfer require later specification.

## 6. Visibility and Permissions

### 6.1 Visibility scopes

Projects, requirements, questions, owned items, and contextual threads use deliberate visibility controls. Supported scopes should include:

- **Private** — owner only.
- **Selected people** — one or more named people.
- **Trusted people** — all people to whom the owner has granted access.
- **Selected clubs** — members of one or more named clubs.

Public visibility is outside the MVP.

### 6.2 Inheritance

- A project is private by default.
- Child entities inherit the project's visibility by default.
- A child entity may narrow inherited visibility.
- The MVP should not allow a child entity to become more broadly visible than its private parent without an explicit, clearly explained action.
- Answers and discussions inherit the visibility of the entity to which they are attached.
- Changing visibility must immediately affect subsequent access to the entity and its thread.

Possession of an item and willingness to share it are distinct. An item must be explicitly marked **Available to Lend** or **Surplus Available** before it appears in availability browsing or search.

## 7. Discovery and Search

### 7.1 Search scopes

Users can search and browse content they are permitted to see, including:

- Their own active and completed projects.
- Shared completed projects in the project library.
- Available-to-lend tools.
- Surplus materials and consumables.
- Other users' visible, unresolved project requirements.
- Questions shared with them.

Search may be scoped to selected people, trusted people, a club, or all content visible to the user.

### 7.2 Reverse-index discovery

The system should answer both sides of a need:

- “Who I can see has a 1/4-20 set screw available?”
- “Who I can see needs 14-gauge wire?”

Results must respect visibility, relationship, club, availability, and requirement state. Exact geographic-radius searching is not required for the MVP, although a club may have a location.

### 7.3 Contextual response

An available item or visible need may have a lightweight in-app discussion thread so people can make contact and arrange details. The application records the conversation but does not manage reservations, pickup, delivery, loans, returns, payment, or disputes.

A possible future convenience feature is a personal tracker such as “Who has my hammer?” It is not part of the MVP.

## 8. Notifications

The MVP should notify a user when:

- Someone answers their visible question.
- Someone responds to an available item or visible need.
- Their access to relevant shared content changes, where appropriate.

Notification delivery channels and digest behavior remain to be specified. A basic in-app notification center is sufficient for the initial product definition.

## 9. Explicitly Out of Scope for MVP

- Collaborative project editing.
- Formal task assignment to other users.
- Payments, deposits, escrow, or financial settlement.
- Shipping, delivery, or pickup coordination workflows.
- Public marketplace listings.
- Ratings, reviews, or reputation scores.
- Formal rental contracts or fixed loan terms.
- Inventory reservation, allocation, or library-style loan management.
- Native mobile applications.
- AI-assisted extraction, entry, classification, or matching.
- A universal structured specification system for all item types.
- Automated taxonomy consolidation.
- Public social feeds, followers, reactions, or creator analytics.
- Operational group-buy management.

## 10. Backlog and Future Opportunities

- Loan/possession reminders, including “Who has my hammer?”
- Taxonomy administration, duplicate consolidation, canonical items, and structured domain attributes.
- Geographic discovery with privacy-preserving location controls.
- Richer project collaboration and task assignment.
- Public project showcasing and discovery.
- Inventory quantity accounting and cross-project allocation.
- More advanced club governance and moderation.
- Native mobile applications.
- AI-assisted item recognition or project entry.
- Group buying: from a missing project requirement, the user can choose **Start a Group-Buy Thread**. Future work must define commitment, ordering, payment, receipt, distribution, and dropout handling before this becomes an operational workflow.

## 11. Product Risks and Open Design Work

1. **Generic task-manager risk:** The product must be substantially better for physical projects through integrated requirements, tools, questions, and reuse—not merely a clean checklist.
2. **Taxonomy complexity:** Search must remain useful while accepting inconsistent user-entered terminology.
3. **Privacy and safety:** Visibility of valuable tools, locations, and unfinished projects requires conservative defaults and understandable access controls.
4. **Cold-start value:** The personal workflow must provide value before friends or clubs participate.
5. **Stale availability:** Informal inventory may become inaccurate. The interface should make availability easy to confirm or withdraw without pretending to guarantee it.
6. **Scope expansion:** Public showcasing, messaging, marketplace mechanics, and group purchasing can each become separate products and should remain constrained until the core loop is validated.

The following still require product or interaction design before implementation:

- Whether projects need due dates, ordering, attachments, photos, and rich notes in the first release.
- Rules and depth limits, if any, for project hierarchy.
- Club joining, invitations, ownership transfer, and member removal.
- Exact behavior for deleting users, projects, items, questions, and answers.
- Notification delivery and preference controls.
- Search ranking, aliases, typo tolerance, and later taxonomy consolidation.
- Whether location belongs on users, clubs, items, or none of them in the MVP.
- Abuse reporting and blocking, even within a non-public network.

---

# Appendix A: Product-Discovery Q&A and Decisions

This appendix preserves the discussion that produced the requirements above. Wording has been condensed while retaining the decisions and their rationale.

## A.1 Audience, problems, and initial wedge

**Q: Who is the first specific user?**  
**A:** Individuals undertaking projects for themselves—makers broadly construed.

**Q: What causes them to open the app?**  
**A:** Planning a project, tracking its to-dos, finding an item, or determining what must be bought to finish the project.

**Q: What is the single-player loop?**  
**A:** Clean personal project and task management. Notes, Obsidian, and many other tools can cover parts of this workflow, so the larger advantage appears when the user needs collaboration, tools, materials, advice, or a way to share surplus for goodwill.

**Q: Which capability should be launched first?**  
**A:** Projects and tasks, designed to expand into consumable exchange and advice.

**Q: What proves the MVP works?**  
**A:** Users create projects; add and complete tasks; add needed materials and fulfill them; and ask questions that are answered or closed.

## A.2 Project sharing and collaboration

**Q: What problems should project sharing solve?**  
**A:** Asking for help (8/10), revealing needed tools or materials (8/10), revealing available tools or materials (8/10), showcasing work (6/10), coordinating tasks (4/10), and collaborating on the same project (3/10).

**Q: Is collaborative project editing required in v1?**  
**A:** No. In-app questions, answers, and contextual item/need discussions are allowed, but other people do not edit the project.

**Q: What happens to completed projects?**  
**A:** They remain in a searchable project library and may be duplicated as reusable starting points. A separate Archived status is omitted because it does not currently add a distinct behavior.

## A.3 Example projects and project structure

**Q: Which projects should feel native?**  
**A:** Repairing boat-head plumbing; building an electronic tension meter with airborne Wi-Fi or LoRa telemetry; and producing custom-sized boat mattresses.

**Q: What does a task need beyond a checkbox?**  
**A:** Task categories and optional links to a person, project requirement, or project question. A task is always subordinate to a project.

**Q: Which task states are needed?**  
**A:** Backlog, In Progress, Blocked, and Done.

**Q: Do requirements belong to projects or tasks?**  
**A:** Requirements belong to projects, with optional links from tasks.

**Q: Do projects need hierarchy?**  
**A:** Yes. Projects may be organized beneath larger projects, such as survey-report items under a larger body of work.

**Q: Do projects need timeline categories?**  
**A:** Yes; examples include Urgent, Later, Winter, Sunny Day, At the Shop, and On the Hard. Because these mix timing, urgency, weather, and location, the PRD models them as user-defined, multi-select planning buckets.

## A.4 Requirements, inventory, and availability

**Q: How is inventory entered without becoming a chore?**  
**A:** A project contains a BOM-like requirements list. Surplus consumables and available tools emerge from project use and may be explicitly shared from there.

**Q: Is this strictly a bill of materials?**  
**A:** No. It includes materials plus non-standard tools needed by the project. The PRD therefore calls it Project Requirements.

**Q: What does fulfillment mean?**  
**A:** The item exists and is available for the project.

**Q: Can one item satisfy multiple projects?**  
**A:** Yes, including consumables such as wire sold or held by the foot. MVP quantities remain informal and do not reserve or allocate stock.

**Q: Should quantities and units be structured?**  
**A:** Use free text in v1. Item identities such as “14-gauge wire” or “1/4-20 set screw” should participate in a growing searchable and browsable taxonomy.

**Q: Who controls taxonomy terms?**  
**A:** Users may suggest item names. Consolidation and canonicalization are backlog work.

**Q: Does fulfilling a requirement automatically create inventory?**  
**A:** No. The product may prompt the user to add or link an owned item, but the user must choose deliberately.

**Q: Which items appear in shared search?**  
**A:** Only items explicitly marked Available to Lend or Surplus Available, subject to visibility permissions.

**Q: May unresolved needs also be browsed and reverse-indexed?**  
**A:** Yes. Authorized people can browse both supply and demand.

**Q: How formal is lending?**  
**A:** The app supports availability and personal connection, not library management. Tracking who currently has an item is a possible backlog feature.

## A.5 People, clubs, and visibility

**Q: What is a club?**  
**A:** An owner-managed group that may be private or open and may or may not have a location.

**Q: How do friend relationships work?**  
**A:** Access is one-sided. One person can grant another visibility without reciprocity. The app may suggest completing the relationship in both directions.

**Q: Do club members automatically become friends?**  
**A:** The original suggestion was to offer an option to add all club members. The refined requirement keeps club-derived access separate and makes person-to-person connection explicit.

**Q: What are the visibility defaults?**  
**A:** Projects are private by default. Entities may be shared with selected people, trusted people, or clubs. Child entities inherit project visibility and may narrow it.

## A.6 Questions and contextual communication

**Q: How is advice requested?**  
**A:** Questions have visibility selectors like other project entities: private, selected people, trusted people, or selected clubs.

**Q: Can recipients answer inside the app?**  
**A:** Yes. Q&A and contextual discussions are part of v1 even though collaborative project editing is not.

**Q: Can people respond to available items and visible needs?**  
**A:** Yes, through lightweight attached discussions. The system does not manage the resulting exchange.

## A.7 Deferred features

**Q: What is a group buy?**  
**A:** It is a minor backlog feature initiated from a missing project requirement through a **Start a Group-Buy Thread** action. Operational handling remains undefined and outside v1.

**Q: What is explicitly outside v1?**  
**A:** Payments, shipping, public marketplace listings, ratings, formal rental terms, native mobile apps, and AI features, along with the other exclusions listed in Section 9.
