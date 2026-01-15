import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ArrowUpDown,
  Check,
  X,
  Info,
} from "lucide-react";

type AmountType = "Recurrent" | "One-time";

type QuotaDefinition = {
  name: string;
  key: string;
  price: number;
  amount: AmountType;
  range: string; // "-" if none
  qpid: number;
};

type SelectedQuota = {
  qpid: number;
  key: string;
  name: string;
  amount: AmountType;
  range: string;
  unitPrice: number;
  grantQuantity: number;
  overrideReason?: string;
};

type Cadence = "Monthly" | "Quarterly" | "Annual";

type SortKey = "name" | "price" | "amount" | "qpid";
type SortDir = "asc" | "desc";

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

function clampInt(value: string, min: number) {
  const v = Number(value);
  if (!Number.isFinite(v)) return { ok: false, value: min };
  const i = Math.floor(v);
  if (i < min) return { ok: false, value: min };
  return { ok: true, value: i };
}

function safeStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Single-page prototype that mimics the admin layout in your screenshot:
 * - Left sidebar with SearchAtlas branding
 * - Top header row, breadcrumbs
 * - Main white card with "Subscription Details" form
 * - Second section "Custom Quotas"
 * - Bottom sticky action bar with "Save and add another", "Save and continue editing", "Save"
 *
 * TODO: Adjust colors/spacing/typography to perfectly match the real admin once you provide more screenshots.
 */
export default function CustomPlanBuilderPrototype() {
  // Fake initial load to show skeletons
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await sleep(600);
      setLoading(false);
    })();
  }, []);

  // Form state
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [cadence, setCadence] = useState<Cadence>("Monthly");
  const [effectiveDate, setEffectiveDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(true);

  // Mock customers/plans/prices
  const customers = useMemo(
    () => [
      { id: "cus_001", name: "Acme Agency" },
      { id: "cus_002", name: "Vertex Media" },
      { id: "cus_003", name: "Nile Ventures" },
      { id: "cus_004", name: "Broadacres Holdings" },
      { id: "cus_005", name: "CapeTown SEO Co." },
    ],
    []
  );

  const plans = useMemo(
    () => [
      { id: "plan_starter", name: "Starter" },
      { id: "plan_growth", name: "Growth" },
      { id: "plan_pro", name: "Pro" },
      { id: "plan_enterprise", name: "Enterprise" },
    ],
    []
  );

  const prices = useMemo(
    () => [
      { id: "price_starter_99", label: "$99/mo reference" },
      { id: "price_growth_199", label: "$199/mo reference" },
      { id: "price_pro_399", label: "$399/mo reference" },
      { id: "price_enterprise_999", label: "$999/mo reference" },
    ],
    []
  );

  // Quota definitions
  const quotaDefs = useMemo<QuotaDefinition[]>(() => {
    // Includes 1–2 messy rows on purpose
    return [
      {
        name: "URL Indexer",
        key: "quota_qp_url_indexer",
        price: 1,
        amount: "One-time",
        range: "-",
        qpid: 47,
      },
      {
        name: "100 keywords - $7",
        key: "quota_ke_allowed_tracked_keywords_100",
        price: 7,
        amount: "Recurrent",
        range: "-",
        qpid: 43,
      },
      {
        name: "Extra Seats",
        key: "seats",
        price: 35,
        amount: "Recurrent",
        range: "-",
        qpid: 42,
      },
      {
        name: "CA Allowed Otto V2 Projects",
        key: "quota_ca_allowed_otto_v2_projects",
        price: 25,
        amount: "Recurrent",
        range: "1–50",
        qpid: 52,
      },
      {
        name: "CA Allowed Focus Terms",
        key: "quota_ca_allowed_focus_terms",
        price: 10,
        amount: "Recurrent",
        range: "1–500",
        qpid: 53,
      },
      {
        name: "KE Allowed Local Serps Heatmap Searches",
        key: "quota_ke_allowed_local_serps_heatmap_searches",
        price: 15,
        amount: "Recurrent",
        range: "0–5000",
        qpid: 54,
      },
      {
        name: "Backlink Analyzer Credits",
        key: "quota_ke_allowed_backlink_credits",
        price: 9,
        amount: "Recurrent",
        range: "-",
        qpid: 55,
      },
      {
        name: "Site Audit Crawls",
        key: "quota_ca_allowed_site_audit_crawls",
        price: 12,
        amount: "Recurrent",
        range: "0–200",
        qpid: 56,
      },
      {
        name: "Content Briefs",
        key: "quota_ca_allowed_content_briefs",
        price: 8,
        amount: "Recurrent",
        range: "-",
        qpid: 57,
      },
      {
        name: "AI Writer Words Pack",
        key: "quota_ca_allowed_ai_writer_words_pack",
        price: 20,
        amount: "One-time",
        range: "10k–1M",
        qpid: 58,
      },
      {
        name: "Keyword Clustering Runs",
        key: "quota_ke_allowed_keyword_clustering_runs",
        price: 18,
        amount: "Recurrent",
        range: "-",
        qpid: 59,
      },
      {
        name: "Rank Tracker Campaigns",
        key: "quota_ca_allowed_rank_tracker_campaigns",
        price: 22,
        amount: "Recurrent",
        range: "0–25",
        qpid: 60,
      },
      {
        name: "Competitor Domains",
        key: "quota_ca_allowed_competitor_domains",
        price: 11,
        amount: "Recurrent",
        range: "0–50",
        qpid: 61,
      },
      {
        name: "GMB Scan Credits",
        key: "quota_ke_allowed_gmb_scan_credits",
        price: 14,
        amount: "Recurrent",
        range: "-",
        qpid: 62,
      },
      {
        name: "Report Exports",
        key: "quota_ca_allowed_report_exports",
        price: 6,
        amount: "Recurrent",
        range: "-",
        qpid: 63,
      },
      {
        name: "SERP Snapshots",
        key: "quota_ke_allowed_serp_snapshots",
        price: 13,
        amount: "Recurrent",
        range: "0–10000",
        qpid: 64,
      },
      {
        name: "Link Outreach Seats",
        key: "quota_ca_allowed_outreach_seats",
        price: 19,
        amount: "Recurrent",
        range: "1–20",
        qpid: 65,
      },
      {
        name: "Local Listings Locations",
        key: "quota_ca_allowed_local_listings_locations",
        price: 17,
        amount: "Recurrent",
        range: "1–1000",
        qpid: 66,
      },
      {
        name: "IndexNow Submissions",
        key: "quota_ke_allowed_indexnow_submissions",
        price: 5,
        amount: "One-time",
        range: "-",
        qpid: 67,
      },
      // Messy rows (still display, no crash)
      { name: "12345", key: "98765", price: 0, amount: "One-time", range: "-", qpid: 999 },
      { name: "null", key: "quota__broken_key__", price: 3, amount: "Recurrent", range: "-", qpid: 1000 },
    ];
  }, []);

  // Selected quotas
  const [selected, setSelected] = useState<SelectedQuota[]>([]);

  // Left table controls
  const [search, setSearch] = useState("");
  const [amountFilter, setAmountFilter] = useState<"All" | AmountType>("All");
  const [rangeFilter, setRangeFilter] = useState<"All" | "Has range" | "No range">("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Toasts
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string }>>([]);
  const pushToast = (msg: string) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  };

  // Price override dialog
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceDialogTarget, setPriceDialogTarget] = useState<SelectedQuota | null>(null);
  const [overridePrice, setOverridePrice] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState<string>("");

  const openOverrideDialog = (q: SelectedQuota) => {
    setPriceDialogTarget(q);
    setOverridePrice(String(q.unitPrice));
    setOverrideReason(q.overrideReason || "");
    setPriceDialogOpen(true);
  };

  // Save confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Derived
  const selectedQpids = useMemo(() => new Set(selected.map((s) => s.qpid)), [selected]);

  const filteredSorted = useMemo(() => {
    const s = search.trim().toLowerCase();
    let rows = quotaDefs.filter((q) => {
      const name = safeStr(q.name).toLowerCase();
      const key = safeStr(q.key).toLowerCase();
      const matchesSearch = !s || name.includes(s) || key.includes(s);

      const matchesAmount = amountFilter === "All" ? true : q.amount === amountFilter;

      const hasRange = safeStr(q.range) !== "-" && safeStr(q.range).trim() !== "";
      const matchesRange =
        rangeFilter === "All"
          ? true
          : rangeFilter === "Has range"
          ? hasRange
          : !hasRange;

      return matchesSearch && matchesAmount && matchesRange;
    });

    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;

      const av =
        sortKey === "name"
          ? safeStr(a.name).toLowerCase()
          : sortKey === "amount"
          ? a.amount
          : sortKey === "price"
          ? a.price
          : a.qpid;

      const bv =
        sortKey === "name"
          ? safeStr(b.name).toLowerCase()
          : sortKey === "amount"
          ? b.amount
          : sortKey === "price"
          ? b.price
          : b.qpid;

      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return safeStr(av).localeCompare(safeStr(bv)) * dir;
    });

    return rows;
  }, [quotaDefs, search, amountFilter, rangeFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  useEffect(() => {
    setPage(1);
  }, [search, amountFilter, rangeFilter, sortKey, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page]);

  const monthlyTotal = useMemo(() => {
    return selected
      .filter((q) => q.amount === "Recurrent")
      .reduce((sum, q) => sum + q.unitPrice * q.grantQuantity, 0);
  }, [selected]);

  const oneTimeTotal = useMemo(() => {
    return selected
      .filter((q) => q.amount === "One-time")
      .reduce((sum, q) => sum + q.unitPrice * q.grantQuantity, 0);
  }, [selected]);

  // Validation
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!selectedCustomerId) e.customer = "Customer is required.";
    if (!selectedPlanId) e.plan = "Plan is required.";
    if (!selectedPriceId) e.price = "Price is required.";
    if (!amount.trim()) e.amount = "Amount is required.";
    if (!cadence) e.cadence = "Frequency is required.";
    return e;
  }, [selectedCustomerId, selectedPlanId, selectedPriceId, amount, cadence]);

  const hasInvalidQuantity = useMemo(() => {
    return selected.some((q) => !Number.isInteger(q.grantQuantity) || q.grantQuantity < 1);
  }, [selected]);

  const saveEnabled = useMemo(() => {
    return Object.keys(errors).length === 0 && !hasInvalidQuantity;
  }, [errors, hasInvalidQuantity]);

  // Handlers
  const addQuota = (q: QuotaDefinition) => {
    if (selectedQpids.has(q.qpid)) return;

    const next: SelectedQuota = {
      qpid: q.qpid,
      key: safeStr(q.key),
      name: safeStr(q.name),
      amount: q.amount,
      range: safeStr(q.range) || "-",
      unitPrice: q.price,
      grantQuantity: 1,
    };

    setSelected((s) => [...s, next]);
    pushToast("Quota added");
  };

  const removeQuota = (qpid: number) => {
    setSelected((s) => s.filter((x) => x.qpid !== qpid));
    pushToast("Quota removed");
  };

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const setQty = (qpid: number, value: string) => {
    setSelected((s) =>
      s.map((q) => {
        if (q.qpid !== qpid) return q;
        const parsed = clampInt(value, 1);
        return { ...q, grantQuantity: parsed.value };
      })
    );
  };

  const saveOverride = () => {
    if (!priceDialogTarget) return;
    const parsed = Number(overridePrice);
    if (!Number.isFinite(parsed) || parsed < 0) return;

    setSelected((s) =>
      s.map((q) =>
        q.qpid === priceDialogTarget.qpid
          ? { ...q, unitPrice: parsed, overrideReason: overrideReason.trim() || undefined }
          : q
      )
    );

    setPriceDialogOpen(false);
    setPriceDialogTarget(null);
    pushToast("Price updated");
  };

  const onSave = () => {
    if (!saveEnabled) {
      pushToast("Fix validation errors before saving");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmSave = () => {
    const payload = {
      customerId: selectedCustomerId,
      basePlanId: selectedPlanId,
      planPrice: Number(amount),
      cadence,
      effectiveDate: effectiveDate || new Date().toISOString().slice(0, 10),
      notes: notes.trim() ? notes.trim() : undefined,
      quotas: selected.map((q) => ({
        qpid: q.qpid,
        key: q.key,
        name: q.name,
        amount: q.amount,
        range: q.range,
        unitPrice: q.unitPrice,
        grantQuantity: q.grantQuantity,
      })),
    };

    // Prototype: log payload only
    // eslint-disable-next-line no-console
    console.log("Custom plan payload:", payload);

    setConfirmOpen(false);
    pushToast("Custom plan saved");
  };

  // Customer dropdown (simple typeahead)
  const customerMatches = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    if (!q) return customers.slice(0, 6);
    return customers.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [customerQuery, customers]);

  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const customerBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!customerBoxRef.current) return;
      if (!customerBoxRef.current.contains(e.target as Node)) setCustomerDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast stack */}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* Top chrome */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white md:block">
          <div className="px-5 py-4">
            <div className="text-lg font-semibold">SearchAtlas</div>
            <div className="text-xs text-slate-500">linkgraph</div>
          </div>

          <div className="px-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-300"
                placeholder="Search apps and models..."
              />
            </div>
          </div>

          <div className="mt-5 px-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Customer
          </div>
          <nav className="mt-2 space-y-1 px-2 text-sm">
            {[
              "Customer",
              "Order",
              "Order deliverables",
              "Placements",
              "Projects",
              "Invoices",
              "Charges",
              "Customer plans",
              "Client credentials",
              "Customer Auto Billings",
            ].map((item) => (
              <div
                key={item}
                className={cn(
                  "rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50",
                  item === "Charges" && "bg-slate-50 font-medium"
                )}
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-6 px-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Content
          </div>
          <nav className="mt-2 space-y-1 px-2 pb-6 text-sm">
            {[
              "Articles",
              "Articles posted",
              "Article style",
              "Article publication assignment approvals",
              "Article awaiting publication assignments",
              "Onsite contents",
              "Placement tags",
            ].map((item) => (
              <div key={item} className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50">
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Top header strip */}
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Add Custom Base Subscription</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-100" />
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-6 pb-3">
              <div className="text-xs text-slate-500">
                Home <span className="mx-1">/</span> Billing Management{" "}
                <span className="mx-1">/</span> Custom Base Subscriptions{" "}
                <span className="mx-1">/</span> Add Custom Base Subscription
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Main card */}
            <div className="rounded-md border border-slate-200 bg-white">
              {/* Section heading */}
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700">
                Subscription Details
              </div>

              <div className="px-5 py-6">
                {/* Customer */}
                <Field label="Customer" required error={errors.customer}>
                  {loading ? (
                    <SkeletonLine />
                  ) : (
                    <div className="relative" ref={customerBoxRef}>
                      <div className="flex items-center gap-2">
                        <input
                          className={cn(
                            "w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-slate-300",
                            errors.customer ? "border-red-300" : "border-slate-200"
                          )}
                          placeholder="Search customer..."
                          value={customerQuery}
                          onChange={(e) => {
                            setCustomerQuery(e.target.value);
                            setCustomerDropdownOpen(true);
                          }}
                          onFocus={() => setCustomerDropdownOpen(true)}
                        />
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                          title="Search"
                        >
                          <Search className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        Customer for this custom subscription
                      </div>

                      {customerDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-full rounded-md border border-slate-200 bg-white shadow-sm">
                          {customerMatches.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-slate-600">No matches</div>
                          ) : (
                            customerMatches.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                className={cn(
                                  "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50",
                                  selectedCustomerId === c.id && "bg-slate-50"
                                )}
                                onClick={() => {
                                  setSelectedCustomerId(c.id);
                                  setCustomerQuery(c.name);
                                  setCustomerDropdownOpen(false);
                                }}
                              >
                                <span>{c.name}</span>
                                {selectedCustomerId === c.id && (
                                  <Check className="h-4 w-4 text-slate-700" />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Field>

                {/* Plan */}
                <Field label="Plan" required error={errors.plan}>
                  {loading ? (
                    <SkeletonLine />
                  ) : (
                    <Select
                      value={selectedPlanId}
                      onChange={setSelectedPlanId}
                      placeholder="---------"
                      options={plans.map((p) => ({ value: p.id, label: p.name }))}
                      error={!!errors.plan}
                      helper="Base plan this custom subscription maps to"
                    />
                  )}
                </Field>

                {/* Price */}
                <Field label="Price" required error={errors.price}>
                  {loading ? (
                    <SkeletonLine />
                  ) : (
                    <Select
                      value={selectedPriceId}
                      onChange={setSelectedPriceId}
                      placeholder="---------"
                      options={prices.map((p) => ({ value: p.id, label: p.label }))}
                      error={!!errors.price}
                      helper="Billing product price for reference"
                    />
                  )}
                </Field>

                {/* Amount */}
                <Field label="Amount" required error={errors.amount}>
                  {loading ? (
                    <SkeletonLine />
                  ) : (
                    <>
                      <input
                        className={cn(
                          "w-full max-w-xl rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-slate-300",
                          errors.amount ? "border-red-300" : "border-slate-200"
                        )}
                        placeholder="Custom amount to charge"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="mt-1 text-xs text-slate-500">
                        Custom amount to charge (different from standard plan price)
                      </div>
                    </>
                  )}
                </Field>

                {/* Frequency */}
                <Field label="Frequency" required error={errors.cadence}>
                  {loading ? (
                    <SkeletonLine />
                  ) : (
                    <Select
                      value={cadence}
                      onChange={(v) => setCadence(v as Cadence)}
                      options={[
                        { value: "Monthly", label: "Monthly" },
                        { value: "Quarterly", label: "Quarterly" },
                        { value: "Annual", label: "Annual" },
                      ]}
                      error={!!errors.cadence}
                      helper="Payment frequency"
                    />
                  )}
                </Field>

                {/* Effective date */}
                <Field label="Effective Date">
                  {loading ? (
                    <SkeletonLine />
                  ) : (
                    <>
                      <input
                        type="date"
                        className="w-full max-w-xl rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                      />
                      <div className="mt-1 text-xs text-slate-500">
                        Optional. Defaults to today when saving.
                      </div>
                    </>
                  )}
                </Field>

                {/* Notes */}
                <Field label="Internal Notes">
                  {loading ? (
                    <SkeletonBlock />
                  ) : (
                    <textarea
                      className="w-full max-w-2xl rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      rows={3}
                      placeholder="Optional notes for internal tracking..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  )}
                </Field>

                {/* Is paid toggle */}
                <div className="mt-4 flex items-center gap-3">
                  {loading ? (
                    <SkeletonLine width="180px" />
                  ) : (
                    <>
                      <button
                        type="button"
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full border transition",
                          isPaid
                            ? "border-violet-600 bg-violet-600"
                            : "border-slate-300 bg-slate-200"
                        )}
                        onClick={() => setIsPaid((v) => !v)}
                        aria-label="Toggle paid"
                      >
                        <span
                          className={cn(
                            "inline-block h-5 w-5 rounded-full bg-white transition",
                            isPaid ? "translate-x-5" : "translate-x-1"
                          )}
                        />
                      </button>
                      <div>
                        <div className="text-sm font-medium text-slate-800">Is paid</div>
                        <div className="text-xs text-slate-500">
                          Whether invoice should be marked as paid
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Custom Quotas section */}
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700">
                Custom Quotas
              </div>

              <div className="px-5 py-6">
                {loading ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Available quotas */}
                    <div className="rounded-md border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                        <div className="text-sm font-semibold text-slate-800">Available Quotas</div>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              className="w-64 rounded-md border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-slate-300"
                              placeholder="Search name or key..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3">
                        <FilterPill
                          label="Amount"
                          value={amountFilter}
                          options={["All", "Recurrent", "One-time"]}
                          onChange={(v) => setAmountFilter(v as any)}
                        />
                        <FilterPill
                          label="Range"
                          value={rangeFilter}
                          options={["All", "Has range", "No range"]}
                          onChange={(v) => setRangeFilter(v as any)}
                        />
                        <div className="ml-auto text-xs text-slate-500">
                          {filteredSorted.length} results
                        </div>
                      </div>

                      {filteredSorted.length === 0 ? (
                        <EmptyState
                          title="No quotas found"
                          subtitle="Try adjusting search or filters."
                        />
                      ) : (
                        <>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                              <thead className="bg-slate-50 text-xs text-slate-600">
                                <tr>
                                  <Th sortable onClick={() => toggleSort("name")} active={sortKey === "name"}>
                                    Name <SortIcon active={sortKey === "name"} dir={sortDir} />
                                  </Th>
                                  <Th>Key</Th>
                                  <Th sortable onClick={() => toggleSort("price")} active={sortKey === "price"}>
                                    Price <SortIcon active={sortKey === "price"} dir={sortDir} />
                                  </Th>
                                  <Th sortable onClick={() => toggleSort("amount")} active={sortKey === "amount"}>
                                    Amount <SortIcon active={sortKey === "amount"} dir={sortDir} />
                                  </Th>
                                  <Th>Range</Th>
                                  <Th sortable onClick={() => toggleSort("qpid")} active={sortKey === "qpid"}>
                                    QPID <SortIcon active={sortKey === "qpid"} dir={sortDir} />
                                  </Th>
                                  <Th className="w-12" />
                                </tr>
                              </thead>
                              <tbody>
                                {paged.map((q) => {
                                  const already = selectedQpids.has(q.qpid);
                                  return (
                                    <tr
                                      key={`${q.qpid}_${q.key}`}
                                      className="border-t border-slate-200 hover:bg-slate-50"
                                    >
                                      <Td className="font-medium">{safeStr(q.name) || "-"}</Td>
                                      <Td className="max-w-[260px] truncate text-slate-600">
                                        {safeStr(q.key) || "-"}
                                      </Td>
                                      <Td>{currency(q.price)}</Td>
                                      <Td>
                                        <Badge tone={q.amount === "Recurrent" ? "violet" : "slate"}>
                                          {q.amount}
                                        </Badge>
                                      </Td>
                                      <Td className="text-slate-600">{safeStr(q.range) || "-"}</Td>
                                      <Td>{q.qpid}</Td>
                                      <Td className="text-right">
                                        <IconButton
                                          title={already ? "Already added" : "Add quota"}
                                          disabled={already}
                                          onClick={() => addQuota(q)}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </IconButton>
                                      </Td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
                            <div className="text-xs text-slate-500">
                              Page {page} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                              >
                                Previous
                              </button>
                              <button
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Selected quotas */}
                    <div className="rounded-md border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                        <div className="text-sm font-semibold text-slate-800">Selected Quotas</div>
                        <div className="text-xs text-slate-500">
                          {selected.length} selected
                        </div>
                      </div>

                      {selected.length === 0 ? (
                        <EmptyState
                          title="No quotas selected"
                          subtitle="Click the plus icon on an available quota to add it here."
                        />
                      ) : (
                        <>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                              <thead className="bg-slate-50 text-xs text-slate-600">
                                <tr>
                                  <Th>Name</Th>
                                  <Th>Key</Th>
                                  <Th>Unit Price</Th>
                                  <Th>Grant Quantity</Th>
                                  <Th>Amount Type</Th>
                                  <Th>Range</Th>
                                  <Th>QPID</Th>
                                  <Th className="w-12" />
                                </tr>
                              </thead>
                              <tbody>
                                {selected.map((q) => {
                                  const invalid = !Number.isInteger(q.grantQuantity) || q.grantQuantity < 1;
                                  return (
                                    <tr
                                      key={q.qpid}
                                      className="border-t border-slate-200 hover:bg-slate-50"
                                    >
                                      <Td className="font-medium">{q.name}</Td>
                                      <Td className="max-w-[220px] truncate text-slate-600">{q.key}</Td>

                                      <Td>
                                        <div className="flex items-center gap-2">
                                          <span>{currency(q.unitPrice)}</span>
                                          <button
                                            type="button"
                                            className="text-xs font-medium text-violet-700 hover:underline"
                                            onClick={() => openOverrideDialog(q)}
                                          >
                                            Override
                                          </button>
                                        </div>
                                        {q.overrideReason ? (
                                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                            <Info className="h-3.5 w-3.5" />
                                            <span className="truncate max-w-[220px]">
                                              {q.overrideReason}
                                            </span>
                                          </div>
                                        ) : null}
                                      </Td>

                                      <Td>
                                        <input
                                          className={cn(
                                            "w-24 rounded-md border bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-300",
                                            invalid ? "border-red-300" : "border-slate-200"
                                          )}
                                          value={String(q.grantQuantity)}
                                          onChange={(e) => setQty(q.qpid, e.target.value)}
                                        />
                                        {invalid ? (
                                          <div className="mt-1 text-xs text-red-600">Min 1</div>
                                        ) : null}
                                      </Td>

                                      <Td>
                                        <Badge tone={q.amount === "Recurrent" ? "violet" : "slate"}>
                                          {q.amount}
                                        </Badge>
                                      </Td>

                                      <Td className="text-slate-600">{q.range}</Td>
                                      <Td>{q.qpid}</Td>
                                      <Td className="text-right">
                                        <IconButton title="Remove quota" onClick={() => removeQuota(q.qpid)}>
                                          <Trash2 className="h-4 w-4" />
                                        </IconButton>
                                      </Td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="border-t border-slate-200 px-4 py-3">
                            <div className="grid gap-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Selected quotas</span>
                                <span className="font-medium">{selected.length}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Estimated monthly total</span>
                                <span className="font-semibold">{currency(monthlyTotal)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">One-time total</span>
                                <span className="font-semibold">{currency(oneTimeTotal)}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom sticky actions (matches admin style) */}
          <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white">
            <div className="flex items-center justify-end gap-3 px-6 py-3">
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => pushToast("Prototype: Save and add another")}
              >
                Save and add another
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => pushToast("Prototype: Save and continue editing")}
              >
                Save and continue editing
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-md px-4 py-2 text-sm text-white",
                  saveEnabled ? "bg-violet-600 hover:bg-violet-700" : "bg-violet-300"
                )}
                disabled={!saveEnabled}
                onClick={onSave}
              >
                Save
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Override price dialog */}
      {priceDialogOpen && (
        <Modal
          title="Override unit price"
          onClose={() => {
            setPriceDialogOpen(false);
            setPriceDialogTarget(null);
          }}
          footer={
            <>
              <button
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => {
                  setPriceDialogOpen(false);
                  setPriceDialogTarget(null);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
                onClick={saveOverride}
              >
                Save
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="text-sm text-slate-600">
              Quota: <span className="font-medium text-slate-900">{priceDialogTarget?.name}</span>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">New unit price</label>
              <input
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                value={overridePrice}
                onChange={(e) => setOverridePrice(e.target.value)}
                placeholder="e.g. 12"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Reason (optional)
              </label>
              <input
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Why are we overriding this price?"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Save confirmation dialog */}
      {confirmOpen && (
        <Modal
          title="Confirm and Save"
          onClose={() => setConfirmOpen(false)}
          footer={
            <>
              <button
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
                onClick={confirmSave}
              >
                Confirm and Save
              </button>
            </>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="grid gap-2">
                <Row label="Customer" value={customers.find((c) => c.id === selectedCustomerId)?.name || "-"} />
                <Row label="Base plan" value={plans.find((p) => p.id === selectedPlanId)?.name || "-"} />
                <Row label="Reference price" value={prices.find((p) => p.id === selectedPriceId)?.label || "-"} />
                <Row label="Frequency" value={cadence} />
                <Row label="Plan amount" value={amount ? currency(Number(amount)) : "-"} />
                <Row label="Selected quotas" value={String(selected.length)} />
                <Row label="Estimated monthly total" value={currency(monthlyTotal)} />
                <Row label="One-time total" value={currency(oneTimeTotal)} />
              </div>
            </div>
            {notes.trim() ? (
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Internal Notes
                </div>
                <div className="mt-2 text-slate-700">{notes.trim()}</div>
              </div>
            ) : null}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Small UI bits ---------- */

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 text-sm font-medium text-slate-800">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </div>
      {children}
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  error,
  helper,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  error?: boolean;
  helper?: string;
}) {
  return (
    <div>
      <div className="relative max-w-xl">
        <select
          className={cn(
            "w-full appearance-none rounded-md border bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-slate-300",
            error ? "border-red-300" : "border-slate-200"
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
      </div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="relative">
        <select
          className="appearance-none rounded-md border border-slate-200 bg-white px-3 py-1.5 pr-8 text-sm outline-none hover:bg-slate-50 focus:border-slate-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-slate-500" />
      </div>
    </div>
  );
}

function Badge({ tone, children }: { tone: "violet" | "slate"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tone === "violet"
          ? "bg-violet-50 text-violet-700"
          : "bg-slate-100 text-slate-700"
      )}
    >
      {children}
    </span>
  );
}

function IconButton({
  title,
  disabled,
  onClick,
  children,
}: {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );
}

function Th({
  children,
  className,
  sortable,
  onClick,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-3 py-2 font-semibold",
        sortable && "cursor-pointer select-none hover:text-slate-800",
        active && "text-slate-800",
        className
      )}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1">{children}</span>
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap px-3 py-2", className)}>{children}</td>;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={cn("inline-flex items-center", active ? "text-slate-700" : "text-slate-400")}>
      <ArrowUpDown className="h-3.5 w-3.5" />
      <span className="sr-only">{dir}</span>
    </span>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-4 py-10 text-center">
      <div className="text-sm font-semibold text-slate-800">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
    </div>
  );
}

function Modal({
  title,
  children,
  footer,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-md border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-50"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
          {footer}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-slate-600">{label}</div>
      <div className="font-medium text-slate-900">{value}</div>
    </div>
  );
}

/* ---------- Skeletons ---------- */

function SkeletonLine({ width }: { width?: string }) {
  return (
    <div
      className="h-9 rounded-md bg-slate-100"
      style={{ width: width || "100%", maxWidth: "48rem" }}
    />
  );
}

function SkeletonBlock() {
  return <div className="h-24 w-full max-w-2xl rounded-md bg-slate-100" />;
}

function SkeletonCard() {
  return <div className="h-80 rounded-md border border-slate-200 bg-white p-4">
    <div className="h-6 w-40 rounded bg-slate-100" />
    <div className="mt-4 space-y-2">
      <div className="h-9 w-full rounded bg-slate-100" />
      <div className="h-9 w-full rounded bg-slate-100" />
      <div className="h-9 w-full rounded bg-slate-100" />
      <div className="h-9 w-full rounded bg-slate-100" />
    </div>
  </div>;
}
