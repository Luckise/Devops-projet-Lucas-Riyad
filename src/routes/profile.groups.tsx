import { createFileRoute, useNavigate, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, Plus, Users, Shield, Crown, UserPlus, UserMinus, Send, ExternalLink } from "lucide-react";
import { getUserGroups, addMember, removeMember, transferOwnership, renameGroup, userRole, isUserAdmin } from "../lib/groups";
import type { Group } from "../lib/groups";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

export const Route = createFileRoute("/profile/groups")({
  beforeLoad: async () => {
    try {
      const user = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      if (!isUserAdmin(attrs.email || user.userId)) throw redirect({ to: "/profile" });
    } catch (err) {
      if (err instanceof redirect) throw err;
      throw redirect({ to: "/login" });
    }
  },
  component: ProfileGroupsRoute,
});

function ProfileGroupsRoute() {
  const matches = useRouterState({ select: (s) => s.matches });
  const hasChild = matches.some(
    (m) => m.routeId !== "__root__" && m.routeId !== "/profile/groups"
  );
  const navigate = useNavigate();
  const stored = typeof window !== "undefined" ? localStorage.getItem("eat_user_profile") : null;
  const profile = stored ? JSON.parse(stored) : null;
  const email = profile?.email || "";

  const [groups, setGroups] = useState<Group[]>([]);
  const [managing, setManaging] = useState<string | null>(null);
  const [memberInput, setMemberInput] = useState("");
  const [message, setMessage] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<{ groupId: string; memberEmail: string } | null>(null);
  const [confirmTransfer, setConfirmTransfer] = useState<{ groupId: string; memberEmail: string } | null>(null);

  const refresh = () => setGroups(getUserGroups(email));

  useEffect(() => { refresh(); }, [email]);

  const handleAddMember = (groupId: string) => {
    if (!memberInput.trim()) return;
    const ok = addMember(groupId, memberInput.trim());
    setMessage(ok ? `${memberInput.trim()} added` : "Already a member or invalid");
    setMemberInput("");
    refresh();
    setTimeout(() => setMessage(""), 2500);
  };

  const handleRemoveMember = (groupId: string, memberEmail: string) => {
    removeMember(groupId, memberEmail);
    setMessage(`${memberEmail} removed`);
    refresh();
    setTimeout(() => setMessage(""), 2500);
  };

  const handleTransfer = (groupId: string, memberEmail: string) => {
    transferOwnership(groupId, memberEmail);
    setMessage(`Ownership transferred to ${memberEmail}`);
    refresh();
    setTimeout(() => setMessage(""), 2500);
  };

  if (hasChild) return <Outlet />;

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-8 flex items-center gap-4">
          <button onClick={() => window.history.back()} className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-0.5">Clubs</p>
            <h1 className="text-[2rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">My Clubs</h1>
          </div>
        </header>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {groups.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">You are not part of any club yet.</p>
            </div>
          )}

          {groups.map((group) => {
            const role = userRole(group, email);
            return (
              <div key={group.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                <button
                  onClick={() => {
                    setManaging(managing === group.id ? null : group.id);
                    setEditingName(null);
                  }}
                  className="w-full text-left p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        {editingName === group.id ? (
                          <input
                            autoFocus
                            value={editingNameValue}
                            onChange={(e) => setEditingNameValue(e.target.value)}
                            onBlur={() => {
                              if (editingNameValue.trim() && editingNameValue.trim() !== group.name) {
                                renameGroup(group.id, editingNameValue.trim());
                                refresh();
                              }
                              setEditingName(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                              if (e.key === "Escape") setEditingName(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30"
                          />
                        ) : (
                          <h3
                            className="font-bold text-zinc-900 dark:text-white truncate"
                            onDoubleClick={(e) => {
                              if (role !== "Owner") return;
                              e.stopPropagation();
                              setEditingNameValue(group.name);
                              setEditingName(group.id);
                            }}
                          >
                            {group.name}
                          </h3>
                        )}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {role === "Owner" ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              <Crown className="w-3 h-3" /> Owner
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                              <Users className="w-3 h-3" /> Member
                            </span>
                          )}
                          <span className="text-[11px] text-zinc-400">· {group.members.length} {group.members.length === 1 ? "member" : "members"}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronLeft
                      className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
                        managing === group.id ? "-rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {managing === group.id && role === "Owner" && (
                  <div className="border-t border-zinc-200 dark:border-white/10 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Add Member</label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={memberInput}
                          onChange={(e) => setMemberInput(e.target.value)}
                          placeholder="email@efrei.net"
                          className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30"
                        />
                        <button
                          onClick={() => handleAddMember(group.id)}
                          className="w-11 h-11 rounded-xl bg-[var(--ember)] text-white flex items-center justify-center hover:bg-[var(--ember)]/90 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Members</label>
                      <div className="space-y-2">
                        {group.members.map((m) => {
                          const isOwner = m === group.owner;
                          return (
                            <div key={m} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">{m.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="text-sm text-zinc-900 dark:text-white truncate">{m}</span>
                                {isOwner && <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-1">
                                {!isOwner && m !== email && (
                                  <button
                                    onClick={() => setConfirmRemove({ groupId: group.id, memberEmail: m })}
                                    className="w-11 h-11 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                  >
                                    <UserMinus className="w-4 h-4" />
                                  </button>
                                )}
                                {!isOwner && (
                                  <button
                                    onClick={() => setConfirmTransfer({ groupId: group.id, memberEmail: m })}
                                    className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                                    title="Transfer ownership"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
                      <Link
                        to="/profile/groups/$groupId/modify"
                        params={{ groupId: group.id }}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--ember)]/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--ember)]/10 flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-[var(--ember)]" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">Club Page</p>
                            <p className="text-[11px] text-zinc-500">{group.image ? "Edit cover and content" : "Create public page"}</p>
                          </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-zinc-400 -rotate-180" />
                      </Link>
                    </div>
                  </div>
                )}

                {managing === group.id && role === "Member" && (
                  <div className="border-t border-zinc-200 dark:border-white/10 p-5 space-y-3 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Members</label>
                    <div className="space-y-2">
                      {group.members.map((m) => {
                        const isOwner = m === group.owner;
                        return (
                          <div key={m} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">{m.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-sm text-zinc-900 dark:text-white truncate">{m}</span>
                              {isOwner && <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            to="/profile/groups/new"
            className="w-full flex items-center justify-center gap-2.5 p-4 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium text-sm">Create a Club</span>
          </Link>
        </div>
      </div>

      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <UserMinus className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-center text-zinc-900 dark:text-white mb-2">Remove member?</h3>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to remove <strong className="text-zinc-700 dark:text-zinc-300">{confirmRemove.memberEmail}</strong> from this group?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-3 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRemoveMember(confirmRemove.groupId, confirmRemove.memberEmail);
                  setConfirmRemove(null);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-red-600 text-white font-bold text-[13px] hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-center text-zinc-900 dark:text-white mb-2">Transfer ownership?</h3>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">
              You are about to transfer ownership to <strong className="text-zinc-700 dark:text-zinc-300">{confirmTransfer.memberEmail}</strong>. You will become a regular member and will not be able to undo this.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmTransfer(null)}
                className="flex-1 py-3 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleTransfer(confirmTransfer.groupId, confirmTransfer.memberEmail);
                  setConfirmTransfer(null);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-amber-600 text-white font-bold text-[13px] hover:bg-amber-700 transition-colors"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}