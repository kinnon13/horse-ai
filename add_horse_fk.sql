ALTER TABLE public.horse_claims ADD CONSTRAINT horse_claims_horse_id_fkey FOREIGN KEY (horse_id) REFERENCES public.horses(id) ON DELETE CASCADE;
