# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_29_083537) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.bigint "user_id", null: false
    t.string "action_type", null: false
    t.jsonb "details", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["action_type"], name: "index_activities_on_action_type"
    t.index ["created_at"], name: "index_activities_on_created_at"
    t.index ["task_id"], name: "index_activities_on_task_id"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "task_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_comments_on_task_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "notifiable_type"
    t.bigint "notifiable_id"
    t.string "notification_type", null: false
    t.boolean "read", default: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_notifications_on_created_at"
    t.index ["notifiable_type", "notifiable_id"], name: "index_notifications_on_notifiable_type_and_notifiable_id"
    t.index ["notification_type"], name: "index_notifications_on_notification_type"
    t.index ["read"], name: "index_notifications_on_read"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "status", default: "active", null: false
    t.string "visibility", default: "private", null: false
    t.string "color"
    t.string "icon"
    t.bigint "workspace_id", null: false
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "banner_image_url"
    t.string "banner_gradient"
    t.string "color_scheme"
    t.datetime "last_updated_at"
    t.index ["owner_id"], name: "index_projects_on_owner_id"
    t.index ["workspace_id", "name"], name: "index_projects_on_workspace_id_and_name", unique: true
    t.index ["workspace_id"], name: "index_projects_on_workspace_id"
  end

  create_table "subtasks", force: :cascade do |t|
    t.string "title", null: false
    t.boolean "is_completed", default: false, null: false
    t.integer "position", default: 0
    t.bigint "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "blocker_note"
    t.text "note"
    t.index ["task_id", "position"], name: "index_subtasks_on_task_id_and_position"
    t.index ["task_id"], name: "index_subtasks_on_task_id"
  end

  create_table "taggings", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["task_id", "tag_id"], name: "index_taggings_on_task_id_and_tag_id", unique: true
    t.index ["task_id"], name: "index_taggings_on_task_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.string "color", default: "#6366f1", null: false
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id", "name"], name: "index_tags_on_project_id_and_name", unique: true
    t.index ["project_id"], name: "index_tags_on_project_id"
  end

  create_table "task_assignments", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.bigint "user_id", null: false
    t.string "role", default: "assignee"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id", "user_id"], name: "index_task_assignments_on_task_id_and_user_id", unique: true
    t.index ["task_id"], name: "index_task_assignments_on_task_id"
    t.index ["user_id"], name: "index_task_assignments_on_user_id"
  end

  create_table "task_attachments", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.bigint "user_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_task_attachments_on_task_id"
    t.index ["user_id"], name: "index_task_attachments_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "status", default: "todo", null: false
    t.string "priority", default: "medium", null: false
    t.datetime "due_date"
    t.integer "position", default: 0
    t.bigint "project_id", null: false
    t.bigint "creator_id", null: false
    t.bigint "assignee_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "task_type", default: "task"
    t.index ["assignee_id"], name: "index_tasks_on_assignee_id"
    t.index ["creator_id"], name: "index_tasks_on_creator_id"
    t.index ["position"], name: "index_tasks_on_position"
    t.index ["project_id", "position"], name: "index_tasks_on_project_id_and_position"
    t.index ["project_id", "status"], name: "index_tasks_on_project_id_and_status"
    t.index ["project_id"], name: "index_tasks_on_project_id"
    t.index ["task_type"], name: "index_tasks_on_task_type"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "phone_number"
    t.string "otp_method", default: "email"
    t.string "otp_code"
    t.datetime "otp_expires_at"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "preferences", default: {}
    t.string "avatar_url"
    t.string "job_title"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["preferences"], name: "index_users_on_preferences", using: :gin
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "workspace_members", force: :cascade do |t|
    t.bigint "workspace_id", null: false
    t.bigint "user_id", null: false
    t.string "role", default: "member", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_workspace_members_on_user_id"
    t.index ["workspace_id", "user_id"], name: "index_workspace_members_on_workspace_id_and_user_id", unique: true
    t.index ["workspace_id"], name: "index_workspace_members_on_workspace_id"
  end

  create_table "workspaces", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "logo_url"
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_workspaces_on_owner_id"
    t.index ["slug"], name: "index_workspaces_on_slug", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "activities", "tasks"
  add_foreign_key "activities", "users"
  add_foreign_key "comments", "tasks"
  add_foreign_key "comments", "users"
  add_foreign_key "notifications", "users"
  add_foreign_key "projects", "users", column: "owner_id"
  add_foreign_key "projects", "workspaces"
  add_foreign_key "subtasks", "tasks"
  add_foreign_key "taggings", "tags"
  add_foreign_key "taggings", "tasks"
  add_foreign_key "tags", "projects"
  add_foreign_key "task_assignments", "tasks"
  add_foreign_key "task_assignments", "users"
  add_foreign_key "task_attachments", "tasks"
  add_foreign_key "task_attachments", "users"
  add_foreign_key "tasks", "projects"
  add_foreign_key "tasks", "users", column: "assignee_id"
  add_foreign_key "tasks", "users", column: "creator_id"
  add_foreign_key "workspace_members", "users"
  add_foreign_key "workspace_members", "workspaces"
  add_foreign_key "workspaces", "users", column: "owner_id"
end
