insert into exchange_posts (author, role, category, lens_id, title, body, status, likes_seed)
values
  ('Dr. Simone Akande', 'Youth Development Researcher · Boston University', 'research', 1, 'Magnitude vs. Stability: are these empirically separable in adolescent samples?', 'I have been applying the PPY framework to our longitudinal data and running into a challenge. Magnitude and Stability feel theoretically distinct, but in our data they correlate highly. Has anyone thought through measurement designs that could better discriminate between them?', 'approved', 14),
  ('Tanya Osei-Mensah', 'Program Director · YouthBuild Chicago', 'practice', 7, 'Using the Normative Climate lens for community asset mapping', 'We ran a six-week youth participatory action research project using the seven lenses as an organizing frame. Normative Climate was the most generative.', 'approved', 33)
on conflict do nothing;
