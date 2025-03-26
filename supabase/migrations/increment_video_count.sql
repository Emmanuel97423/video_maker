begin
  update user_quotas
  set 
    video_count = video_count + 1,
    updated_at = now()
  where user_id = user_id_param;
end;
