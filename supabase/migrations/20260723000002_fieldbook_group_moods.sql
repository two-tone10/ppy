create or replace function fieldbook_group_moods(p_program_code text)
returns table(x numeric, y numeric)
language sql security definer set search_path = public
as $$
  with eligible as (
    select round(x / 20.0) * 20 as x, round(y / 20.0) * 20 as y
    from fieldbook_mood_entries
    where setting = p_program_code and created_at > now() - interval '30 days'
  ), count_check as (select count(*) as n from eligible)
  select eligible.x, eligible.y from eligible, count_check where count_check.n >= 5;
$$;
revoke all on function fieldbook_group_moods(text) from public;
grant execute on function fieldbook_group_moods(text) to anon, authenticated;
