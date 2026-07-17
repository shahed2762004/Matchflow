/**
 * Typed schema for the MatchFlow database.
 *
 * This file is hand-authored to match supabase/migrations/0001_initial_schema.sql
 * so the app is fully typed from day one. Once the database is live, regenerate
 * it with:
 *
 *   supabase gen types typescript --local > lib/types/database.types.ts
 *
 * and keep the generated output as the source of truth.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---- Enums -----------------------------------------------------------------
export type TenantStatus = "trial" | "active" | "suspended" | "cancelled";
export type UserRole = "tenant_admin" | "manager" | "employee" | "viewer";
export type PlatformRole = "super_admin" | "support";
export type DataSourceType =
  | "bank_of_palestine"
  | "jawwal_pay"
  | "paypal"
  | "erp"
  | "internal_records"
  | "manual_upload";
export type DataSourceStatus =
  | "connected"
  | "error"
  | "disabled"
  | "pending_setup";
export type TransactionOrigin = "external" | "internal";
export type TransactionStatus = "pending" | "matched" | "unmatched" | "flagged";
export type ReconciliationStatus = "in_progress" | "completed" | "failed";
export type MatchStatus = "matched" | "discrepancy" | "unmatched";
export type MatchType = "auto" | "manual";

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          status: TenantStatus;
          plan: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          status?: TenantStatus;
          plan?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
        Relationships: [];
      };
      platform_admins: {
        Row: {
          id: string;
          full_name: string;
          role: PlatformRole;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: PlatformRole;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["platform_admins"]["Insert"]
        >;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string;
          full_name: string;
          email: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tenant_id: string;
          full_name: string;
          email: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      data_sources: {
        Row: {
          id: string;
          tenant_id: string;
          type: DataSourceType;
          name: string;
          status: DataSourceStatus;
          config: Json;
          last_sync_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          type: DataSourceType;
          name: string;
          status?: DataSourceStatus;
          config?: Json;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["data_sources"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "data_sources_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          id: string;
          tenant_id: string;
          data_source_id: string | null;
          origin: TransactionOrigin;
          external_id: string | null;
          amount: number;
          currency: string;
          transaction_date: string;
          description: string | null;
          raw_data: Json;
          status: TransactionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          data_source_id?: string | null;
          origin: TransactionOrigin;
          external_id?: string | null;
          amount: number;
          currency?: string;
          transaction_date: string;
          description?: string | null;
          raw_data?: Json;
          status?: TransactionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "transactions_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_data_source_id_fkey";
            columns: ["data_source_id"];
            referencedRelation: "data_sources";
            referencedColumns: ["id"];
          },
        ];
      };
      reconciliations: {
        Row: {
          id: string;
          tenant_id: string;
          period_start: string;
          period_end: string;
          status: ReconciliationStatus;
          created_by: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          period_start: string;
          period_end: string;
          status?: ReconciliationStatus;
          created_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["reconciliations"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "reconciliations_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      reconciliation_matches: {
        Row: {
          id: string;
          tenant_id: string;
          reconciliation_id: string;
          external_transaction_id: string | null;
          internal_transaction_id: string | null;
          status: MatchStatus;
          match_type: MatchType;
          confidence_score: number | null;
          discrepancy_amount: number | null;
          notes: string | null;
          matched_by: string | null;
          matched_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          reconciliation_id: string;
          external_transaction_id?: string | null;
          internal_transaction_id?: string | null;
          status?: MatchStatus;
          match_type?: MatchType;
          confidence_score?: number | null;
          discrepancy_amount?: number | null;
          notes?: string | null;
          matched_by?: string | null;
          matched_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["reconciliation_matches"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "reconciliation_matches_reconciliation_id_fkey";
            columns: ["reconciliation_id"];
            referencedRelation: "reconciliations";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          tenant_id: string | null;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      auth_tenant_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      auth_is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      tenant_status: TenantStatus;
      user_role: UserRole;
      platform_role: PlatformRole;
      data_source_type: DataSourceType;
      data_source_status: DataSourceStatus;
      transaction_origin: TransactionOrigin;
      transaction_status: TransactionStatus;
      reconciliation_status: ReconciliationStatus;
      match_status: MatchStatus;
      match_type: MatchType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
